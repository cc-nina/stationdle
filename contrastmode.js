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

contrastSwitch.addEventListener("click", () => {
    if (localStorage.getItem('contrastmode') !== 'active') {
        enableContrastMode();
        contrastSwitch.checked = true;
    } else {
        disableContrastMode();
        contrastSwitch.checked = false;
    }
});
