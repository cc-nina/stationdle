let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('themeswitch')

const enableDarkMode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')
    map.addLayer(dark_tile)
    if (map.hasLayer(light_tile)) {
        
        map.removeLayer(light_tile)
    }
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)
    if (map.hasLayer(dark_tile)) {
        map.addLayer(light_tile)
        map.removeLayer(dark_tile)
    }
}

if (darkmode === 'active') enableDarkMode()
themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkMode() : disableDarkMode()
})

