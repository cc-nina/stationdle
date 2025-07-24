

let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('themeswitch')

const enableDarkMode = () => {
    document.body.classList.add('darkmode')
    localStorage.setItem('darkmode', 'active')

    map.addLayer(dark_tile)
    if (map.hasLayer(light_tile)) {
        
        map.removeLayer(light_tile)
    }

    resultsMap.addLayer(dark_tile_res)
    if (resultsMap.hasLayer(light_tile_res)) {
        
        resultsMap.removeLayer(light_tile_res)
    }
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode')
    localStorage.setItem('darkmode', null)

    if (map.hasLayer(dark_tile)) {
        map.addLayer(light_tile)
        map.removeLayer(dark_tile)
    }
    if (resultsMap.hasLayer(dark_tile_res)) {
        resultsMap.addLayer(light_tile_res)
        resultsMap.removeLayer(dark_tile_res)
    }
}

if (darkmode === 'active') enableDarkMode()

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode')
    darkmode !== "active" ? enableDarkMode() : disableDarkMode()
})


let darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
console.log(darkMode)

if (darkMode) {
    themeSwitch.click();
    enableDarkMode()
} else {
    disableDarkMode()
}

