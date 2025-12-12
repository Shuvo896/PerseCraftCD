const modeButtons = document.querySelectorAll(".mode-selector .mode");

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Wait until DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const modeButtons = {
    lr: document.getElementById("mode-lr"),
    lf: document.getElementById("mode-lf"),
    ff: document.getElementById("mode-ff"),
  };

  // Currently active mode: "lr" by default
  let activeMode = "lr";

  // Set active button style
  function setActiveMode(mode) {
    activeMode = mode;
    for (const key in modeButtons) {
      if (key === mode) {
        modeButtons[key].classList.add("active");
      } else {
        modeButtons[key].classList.remove("active");
      }
    }
    // Clear output on mode switch
    document.getElementById("outputBox").textContent = "";
  }

  // Add click listeners to mode buttons
  modeButtons.lr.addEventListener("click", () => setActiveMode("lr"));
  modeButtons.lf.addEventListener("click", () => setActiveMode("lf"));
  modeButtons.ff.addEventListener("click", () => setActiveMode("ff"));

  // On Craft button click, call the corresponding function
  document.getElementById("craftBtn").addEventListener("click", () => {
    const inputText = document.getElementById("inputBox").value;
    const outputBox = document.getElementById("outputBox");
    outputBox.textContent = "";

    try {
      if (activeMode === "lr") {
        // Call left recursion elimination
        const result = eliminateLeftRecursion(inputText);
        outputBox.textContent = result;
      } else if (activeMode === "lf") {
        // Call left factoring
        const result = leftFactorCalculator(inputText);
        outputBox.textContent = result;
      } else if (activeMode === "ff") {
        // Call first & follow calculator
        const result = computeFirstAndFollowSets(inputText);
        // Format output for first & follow sets
        let txt = "Productions:\n";
        for (const A in result.productions) {
          txt += A + " -> " + result.productions[A].join(" | ") + "\n";
        }
        txt += "\nFIRST sets:\n";
        for (const A in result.FIRST) {
          txt += `FIRST(${A}) = { ${result.FIRST[A].join(", ")} }\n`;
        }
        txt += "\nFOLLOW sets:\n";
        for (const A in result.FOLLOW) {
          txt += `FOLLOW(${A}) = { ${result.FOLLOW[A].join(", ")} }\n`;
        }
        outputBox.textContent = txt;
      }
    } catch (err) {
      outputBox.textContent = "Error: " + err;
    }
  });

  // Initialize default active mode
  setActiveMode("lr");
});
