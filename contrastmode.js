const contrastSwitch = document.getElementById('contrastswitch');

const enableContrastMode = () => {
    document.body.classList.add('contrastmode');
    localStorage.setItem('contrastmode', 'active');
};

const disableContrastMode = () => {
    document.body.classList.remove('contrastmode');
    localStorage.removeItem('contrastmode');
};

if (localStorage.getItem('contrastmode') === 'active') {
    enableContrastMode();
    contrastSwitch.checked = true;
}

function refreshSquaresDisplay() {
    const modal = document.getElementById('modal');
    if (!modal.classList.contains('open')) return;

    const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!state || !state.guessesArr) return;

    const squaresMap = ["✖️", "🟨", "🟩"];
    if (document.body.classList.contains('contrastmode')) {
        squaresMap[1] = "🟦";
        squaresMap[2] = "🟧";
    }

    let squares = state.guessesArr.map(g => squaresMap[g]).join("");
    squares += "⬛".repeat(Math.max(0, 5 - state.guessesArr.length));

    const squareDisplay = document.getElementById('squareDisplay');
    if (squareDisplay) squareDisplay.innerHTML = squares;

    const copyText = document.getElementById('copyText');
    if (copyText) {
        copyText.innerHTML = "Stationdle " + month_string + "/" + day_string + "/" + year_string + "\n\n" + squares + "\n\nhttps://stationdle.vercel.app/";
    }
}

contrastSwitch.addEventListener("click", () => {
    if (localStorage.getItem('contrastmode') !== 'active') {
        enableContrastMode();
        contrastSwitch.checked = true;
    } else {
        disableContrastMode();
        contrastSwitch.checked = false;
    }
    refreshSquaresDisplay();
});
