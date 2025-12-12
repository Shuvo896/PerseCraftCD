// fftable.js (First & Follow Set Logic)

const FF_EPS = "eps";
const FF_END = "$";

function parseGrammar(grammarStr) {
    const grammar = {};
    const lines = grammarStr.split(/\r?\n/);

    for (let raw of lines) {
        const line = raw.trim();
        if (line === "" || line.toUpperCase() === "END") continue;

        const arrow = line.indexOf("->");
        if (arrow === -1) throw "Missing '->' in: " + line;

        const lhs = line.slice(0, arrow).trim();
        const rhsText = line.slice(arrow + 2).trim();

        if (!/^[A-Z]$/.test(lhs))
            throw "LHS must be a single uppercase letter (A-Z): " + lhs;

        // The user input format is A->aB|c (no spaces). 
        // We split the alternatives but keep them as single strings for symbol detection.
        const rhsParts = rhsText.split("|").map(s => s.trim()).map(p => p === "ϵ" ? FF_EPS : p);
        if (rhsParts.length === 0) throw "No RHS alternatives in: " + line;

        // Concatenate productions for the same non-terminal
        grammar[lhs] = (grammar[lhs] || []).concat(rhsParts);
    }

    return grammar;
}

// Function to get individual symbols (non-terminals or terminals) from a production string
// For simplicity and to support complex terminal symbols (like '+', 'id', '(', ')'), 
// this function assumes terminals are all symbols that are NOT non-terminals.
function getSymbols(prodString, nonTerminals) {
    if (prodString === FF_EPS) return [FF_EPS];
    
    // Simple approach: split based on symbols that look like Non-Terminals (single capital letter)
    // and treat everything else as a single terminal symbol.
    // Given the simple A->a|b format, we treat the entire string as one symbol unless it is an NT.
    const symbols = [];
    let i = 0;
    while(i < prodString.length) {
        let foundNT = false;
        for(const NT of nonTerminals) {
            if(prodString.substring(i).startsWith(NT)) {
                symbols.push(NT);
                i += NT.length;
                foundNT = true;
                break;
            }
        }
        if(!foundNT) {
            // Take the rest as one terminal symbol
            symbols.push(prodString.substring(i)); 
            i = prodString.length;
        }
    }

    // A more robust but complex parser is typically used here. Sticking to the most
    // basic interpretation where each item in a sequence is a symbol.
    // If the input is A->aBc, the symbols are [a, B, c].
    // Since the logic provided does *not* use splitting, I will use a simple one-character split 
    // unless the symbol is a non-terminal, which is the most robust simple approach.

    // Given the structure of the logic provided (no internal parsing of 'symbols' in the rules),
    // I will use a simple character-by-character split, which is a common (but often limiting)
    // approach for simple textbook grammars where symbols are single characters.
    // E.g., for A->aB, symbols are ['a', 'B'].

    const chars = prodString.split('');
    const finalSymbols = [];
    for(const char of chars) {
        // If the character is an NT, or it's part of a composite terminal (which is not supported
        // well by the provided logic), we push it as a symbol.
        finalSymbols.push(char);
    }
    
    // Override: Stick to simple characters as symbols to match simple textbook examples.
    return finalSymbols;
}


function computeFirstAndFollowSets(grammarStr) {
    const productions = parseGrammar(grammarStr);
    const nonTerminals = Object.keys(productions);
    if(nonTerminals.length === 0) return { FIRST: {}, FOLLOW: {}, productions: {} };
    const startSymbol = nonTerminals[0];

    const FIRST = {};
    const FOLLOW = {};

    nonTerminals.forEach(nt => {
        FIRST[nt] = new Set();
        FOLLOW[nt] = new Set();
    });

    FOLLOW[startSymbol].add(FF_END);

    function isTerminal(sym) {
        return !nonTerminals.includes(sym) && sym !== FF_EPS;
    }

    function firstOfSymbol(sym) {
        if (sym === FF_EPS) return new Set([FF_EPS]);
        if (isTerminal(sym)) return new Set([sym]);
        return new Set(FIRST[sym]);
    }

    function firstOfSequence(symbols) {
        if (symbols.length === 0) return new Set([FF_EPS]);

        const result = new Set();
        let allEps = true;

        for (let sym of symbols) {
            const f = firstOfSymbol(sym);

            f.forEach(x => {
                if (x !== FF_EPS) result.add(x);
            });

            if (!f.has(FF_EPS)) {
                allEps = false;
                break;
            }
        }

        if (allEps) result.add(FF_EPS);
        return result;
    }

    // --- FIRST sets ---
    let changed = true;
    while (changed) {
        changed = false;

        for (const A of nonTerminals) {
            for (const rhs of productions[A]) {
                const symbols = getSymbols(rhs, nonTerminals); // Use single character symbols
                const before = FIRST[A].size;

                const seqFirst = firstOfSequence(symbols);
                seqFirst.forEach(x => FIRST[A].add(x));

                if (FIRST[A].size > before) changed = true;
            }
        }
    }

    // --- FOLLOW sets ---
    changed = true;
    let iterations = 0;
    const MAX = 1000;

    while (changed && iterations < MAX) {
        iterations++;
        changed = false;

        for (const A of nonTerminals) {
            for (const rhs of productions[A]) {
                const symbols = getSymbols(rhs, nonTerminals); // Use single character symbols

                for (let i = 0; i < symbols.length; i++) {
                    const B = symbols[i];
                    if (!nonTerminals.includes(B)) continue;

                    const beta = symbols.slice(i + 1);
                    const firstBeta = firstOfSequence(beta);

                    const before = FOLLOW[B].size;

                    firstBeta.forEach(x => {
                        if (x !== FF_EPS) FOLLOW[B].add(x);
                    });

                    if (beta.length === 0 || firstBeta.has(FF_EPS)) {
                        FOLLOW[A].forEach(x => FOLLOW[B].add(x));
                    }

                    if (FOLLOW[B].size > before) changed = true;
                }
            }
        }
    }

    // Output formatting: replace internal 'eps' with 'ϵ'
    const result = {
        FIRST: {},
        FOLLOW: {},
        productions: {}
    };

    nonTerminals.forEach(nt => {
        result.FIRST[nt] = Array.from(FIRST[nt]).sort().map(s => s === FF_EPS ? "ϵ" : s);
        result.FOLLOW[nt] = Array.from(FOLLOW[nt]).sort().map(s => s === FF_END ? "$" : s);
    });

    for(const A in productions) {
        result.productions[A] = productions[A].map(p => p === FF_EPS ? "ϵ" : p);
    }

    return result;
}


// Global function to be called by index.js
function runFirstFollowCalculator() {
    const input = document.getElementById("inputBox").value;
    const out = document.getElementById("outputBox");

    try {
        const res = computeFirstAndFollowSets(input);

        let txt = "Productions:\n";
        for (const A in res.productions) {
            txt += A + " -> " + res.productions[A].join(" | ") + "\n";
        }

        txt += "\nFIRST sets:\n";
        for (const A in res.FIRST) {
            txt += `FIRST(${A}) = { ${res.FIRST[A].join(", ")} }\n`;
        }

        txt += "\nFOLLOW sets:\n";
        for (const A in res.FOLLOW) {
            txt += `FOLLOW(${A}) = { ${res.FOLLOW[A].join(", ")} }\n`;
        }

        out.textContent = txt;
    } catch (err) {
        out.textContent = "Error: " + (err instanceof Error ? err.message : err);
    }
}