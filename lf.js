// lf.js (Left Factoring Logic)

function leftFactorCalculator(inputText) {
  const LF_EPS = "eps"; // internal epsilon

  // Utility: trim string
  function trim(s) {
    return s.replace(/^\s+|\s+$/g, "");
  }

  // Validate and parse a production line (A->aB|c)
  function parseProduction(line) {
    const arrow = line.indexOf("->");
    if (arrow === -1) throw "Missing '->' in: " + line;

    const lhs = trim(line.slice(0, arrow));
    const rhsText = trim(line.slice(arrow + 2));

    if (!/^[A-Z]$/.test(lhs))
      throw "LHS must be a single uppercase letter (A-Z): " + lhs;

    const rhsParts = rhsText.split("|").map(trim);
    if (rhsParts.length === 0) throw "No RHS alternatives found";

    for (const p of rhsParts) {
      if (p === "") throw "Empty RHS alternative found";
    }

    return { lhs, rhs: rhsParts };
  }

  // Grammar structure: map LHS -> array of productions
  const grammar = {};

  const lines = inputText.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = trim(lineRaw);
    if (line === "" || line.toUpperCase() === "END") continue;

    const prod = parseProduction(line);
    // Concatenate productions for the same non-terminal
    grammar[prod.lhs] = (grammar[prod.lhs] || []).concat(prod.rhs);
  }

  // Counter for new non-terminals
  let counter = 0;
  function newNonTerminal() {
    counter++;
    return "X" + counter; // X1, X2, ...
  }

  // Compute longest common prefix of multiple strings
  function longestCommonPrefix(strings) {
    if (strings.length === 0) return "";
    let prefix = strings[0];
    for (let s of strings.slice(1)) {
      let i = 0;
      while (i < prefix.length && i < s.length && prefix[i] === s[i]) i++;
      prefix = prefix.slice(0, i);
      if (prefix === "") break;
    }
    return prefix;
  }

  // Recursive left factoring
  function leftFactor(A) {
    let queue = [A];

    while (queue.length > 0) {
      const curr = queue.shift();
      const rules = grammar[curr];
      if (!rules || rules.length <= 1) continue;

      // Group rules by first character
      const groups = {};
      for (const r of rules) {
        const key = r === LF_EPS ? "#" : r[0];
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
      }

      const newRules = [];
      let changedInPass = false;

      for (const key in groups) {
        const prods = groups[key];
        if (prods.length <= 1 || key === "#") {
          // No factoring needed for single rules or epsilon rule
          newRules.push(...prods);
          continue;
        }

        const prefix = longestCommonPrefix(prods);

        if (!prefix || prefix.length < 1) {
          // LCP of length 1 is essentially grouping by first char
          newRules.push(...prods);
          continue;
        }

        // Factoring is required
        // Create new non-terminal
        const newNT = newNonTerminal();
        const newProds = [];

        for (const p of prods) {
          if (p === prefix) newProds.push(LF_EPS);
          else newProds.push(p.slice(prefix.length));
        }

        grammar[newNT] = newProds;
        queue.push(newNT); // queue new non-terminal for further factoring

        newRules.push(prefix + newNT);
        changedInPass = true;
      }

      grammar[curr] = newRules;
    }
  }

  // Perform left factoring for all non-terminals
  // Use a copy of the initial keys to avoid factoring newly created NTs (X1, X2...)
  const initialNTs = Object.keys(grammar);
  for (const A of initialNTs) leftFactor(A);

  // Format output: replace internal 'eps' with 'ϵ'
  let output = "";
  for (const A in grammar) {
    output += A + " -> ";
    output += grammar[A].map((p) => (p === LF_EPS ? "ϵ" : p)).join(" | ");
    output += "\n";
  }

  return output;
}

// Global function to be called by index.js
function runLeftFactoring() {
  const inputText = document.getElementById("inputBox").value;
  const out = document.getElementById("outputBox");
  try {
    const result = leftFactorCalculator(inputText);
    out.textContent = result;
  } catch (err) {
    out.textContent = "Error: " + (err instanceof Error ? err.message : err);
  }
}
