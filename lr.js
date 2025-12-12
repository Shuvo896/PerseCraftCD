// lr.js (Left Recursion Elimination Logic)

const LR_EPS = "eps";
let LRcounter = 0;

function parseLRGrammar(grammarStr) {
    const grammar = {};
    const lines = grammarStr.split(/\r?\n/);
    for (let raw of lines) {
        const line = raw.trim();
        if (line === "" || line.toUpperCase() === "END") continue;
        
        // Expect format: A->aB|c (no spaces around -> or |)
        const arrow = line.indexOf("->");
        if (arrow === -1) throw "Missing '->' in: " + line;

        const lhs = line.slice(0, arrow).trim();
        const rhsText = line.slice(arrow + 2).trim();

        if (!/^[A-Z]$/.test(lhs)) throw "LHS must be a single uppercase letter: " + lhs;
        
        // Splitting by '|'
        const rhs = rhsText.split("|").map(s => s.trim());
        
        // Replace 'ϵ' with internal "eps" and handle spaces in production
        const processedRHS = rhs.map(p => {
            if (p === "ϵ" || p === "eps") return LR_EPS;
            // The logic expects space-separated symbols (e.g., 'E + T' for E -> E+T)
            // But the user's input format is A->A|B (no space), so we keep it as a single string for now 
            // and rely on the string matching logic in eliminateLeftRecursion.
            return p;
        });
        
        grammar[lhs] = processedRHS;
    }
    return grammar;
}

function formatLRGrammar(grammar) {
    let out = "";
    for (const A in grammar) {
        out += A + " -> " + grammar[A].join(" | ") + "\n";
    }
    return out;
}

function newLRNT() {
    LRcounter++;
    return "X" + LRcounter;
}

function eliminateDirectLR(grammar, A, NTs) {
    const prods = grammar[A];
    const rec = [];
    const nonRec = [];

    // NOTE: The provided logic for direct LR elimination assumes symbols are separated by spaces
    // to correctly split 'parts'. I'm adapting it to use the *first character* for left-recursion check, 
    // which aligns better with the user's no-space input format and is simpler for LR elimination.
    for (const p of prods) {
        if (p === LR_EPS) {
             nonRec.push(LR_EPS);
             continue;
        }

        // Check for direct left recursion (A -> Aα)
        if (p.startsWith(A)) {
            // Recurrence part (α) is the rest of the string
            rec.push(p.slice(A.length) || LR_EPS);
        } else {
            nonRec.push(p);
        }
    }
    
    if (rec.length === 0) return;

    const A2 = newLRNT();
    NTs.push(A2); // Add new NT to the list for potential indirect recursion later

    // New A rule: A -> βi A'
    const newA = [];
    for (const p of nonRec) {
        if (p === LR_EPS) {
            newA.push(A2);
        } else {
            newA.push(p + A2);
        }
    }
    grammar[A] = newA;

    // New A' rule: A' -> αj A' | eps
    const newA2 = [LR_EPS];
    for (const r of rec) {
        if (r === LR_EPS) {
            // This should not happen if we use the A -> Aα definition strictly, but including for robustness
            newA2.push(A2); 
        } else {
            newA2.push(r + A2);
        }
    }
    grammar[A2] = newA2;
}


function eliminateLeftRecursion(grammarStr) {
    LRcounter = 0;
    const G = parseLRGrammar(grammarStr);
    const NTs = Object.keys(G);

    // Sort NTs to ensure correct order for general LR elimination (A_0, A_1, ..., A_n)
    NTs.sort(); 

    for (let i = 0; i < NTs.length; i++) {
        const Ai = NTs[i];

        // Replace Ai -> Aj γ productions (for j < i)
        for (let j = 0; j < i; j++) {
            const Aj = NTs[j];
            const productionsToReplace = [];
            const otherProductions = [];

            for (const p of G[Ai]) {
                if (p.startsWith(Aj)) {
                    // This is an indirect left-recursive rule: Ai -> Aj γ
                    const gamma = p.slice(Aj.length);
                    productionsToReplace.push({ gamma });
                } else {
                    otherProductions.push(p);
                }
            }

            if (productionsToReplace.length > 0) {
                // Substitute Aj productions into Ai
                for (const prodToReplace of productionsToReplace) {
                    for (const Ajp of G[Aj]) {
                        if (Ajp === LR_EPS) {
                            // Ai -> Aj γ, Aj -> eps => Ai -> γ
                            otherProductions.push(prodToReplace.gamma || LR_EPS);
                        } else {
                            // Ai -> Aj γ, Aj -> β => Ai -> βγ
                            otherProductions.push(Ajp + prodToReplace.gamma);
                        }
                    }
                }
                G[Ai] = otherProductions;
            }
        }

        // Eliminate direct left recursion in Ai after substitution
        eliminateDirectLR(G, Ai, NTs);
    }
    
    // Replace internal "eps" with 'ϵ' for cleaner output
    const finalG = {};
    for(const A in G) {
        finalG[A] = G[A].map(p => p === LR_EPS ? "ϵ" : p);
    }

    return formatLRGrammar(finalG);
}

// Global function to be called by index.js
function runLeftRecursion() {
    const input = document.getElementById("inputBox").value;
    const out = document.getElementById("outputBox");
    try {
        const result = eliminateLeftRecursion(input);
        out.textContent = result;
    } catch (e) {
        out.textContent = "Error: " + (e instanceof Error ? e.message : e);
    }
}