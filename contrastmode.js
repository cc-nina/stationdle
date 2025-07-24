let contrastmode = localStorage.getItem('contrastmode')
const contrastSwitch = document.getElementById('contrastswitch')

const enableContrastMode = () => {
    document.body.classList.add('contrastmode')
    localStorage.setItem('contrastmode', 'active')
}

const disableContrastMode = () => {
    document.body.classList.remove('contrastmode')
    localStorage.setItem('contrastmode', null)
}

if (contrastmode === 'active') enableContrastMode()

contrastSwitch.addEventListener("click", () => {
    contrastmode = localStorage.getItem('contrastmode')
    contrastmode !== "active" ? enableContrastMode() : disableContrastMode()
})

