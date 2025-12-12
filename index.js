const modeButtons = document.querySelectorAll(".mode-selector .mode");

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});


// index.js (UI and Event Handling)

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modeButtons = document.querySelectorAll('.mode');
    const craftButton = document.getElementById('craftBtn');
    const inputArea = document.getElementById('inputBox');
    const outputArea = document.getElementById('outputBox');

    // State
    let currentMode = 'lr'; // Default mode is Left Recursion Elimination

    // Map mode IDs to their corresponding run functions
    const modeRunners = {
        'lr': runLeftRecursion,
        'lf': runLeftFactoring,
        'ff': runFirstFollowCalculator
    };

    // --- Mode Switching Logic ---
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Update active class
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Update current mode state
            // IDs are: mode-lr, mode-lf, mode-ff
            currentMode = button.id.split('-')[1]; 

            // 3. Clear output for the new mode
            outputArea.textContent = '';
            
            // 4. Update placeholder/tooltip if necessary (optional: not explicitly requested)
            // if (currentMode === 'ff') {
            //     inputArea.placeholder = 'Input Grammar for First/Follow (A->aB|c):';
            // } else {
            //     inputArea.placeholder = 'Input Grammar (A->A|B):';
            // }
        });
    });

    // --- Craft Button Logic ---
    craftButton.addEventListener('click', () => {
        // Clear previous output
        outputArea.textContent = 'Processing...';

        // Get the appropriate function for the current mode
        const runner = modeRunners[currentMode];

        if (runner) {
            // Execute the function
            runner();
        } else {
            outputArea.textContent = 'Error: No logic found for this mode.';
        }
    });

    // Initial message/placeholder setup
    inputArea.placeholder = "Input Grammar (e.g., E->E+T|T). Use 'ϵ' or 'eps' for epsilon.";
});