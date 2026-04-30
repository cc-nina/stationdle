const themeSwitch = document.getElementById('themeswitch');

const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
    if (!map.hasLayer(dark_tile)) map.addLayer(dark_tile);
    if (map.hasLayer(light_tile)) map.removeLayer(light_tile);
    if (!resultsMap.hasLayer(dark_tile_res)) resultsMap.addLayer(dark_tile_res);
    if (resultsMap.hasLayer(light_tile_res)) resultsMap.removeLayer(light_tile_res);
};

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.removeItem('darkmode');
    if (map.hasLayer(dark_tile)) {
        map.addLayer(light_tile);
        map.removeLayer(dark_tile);
    }
    if (resultsMap.hasLayer(dark_tile_res)) {
        resultsMap.addLayer(light_tile_res);
        resultsMap.removeLayer(dark_tile_res);
    }
};

themeSwitch.addEventListener("click", () => {
    if (localStorage.getItem('darkmode') !== 'active') {
        enableDarkMode();
        themeSwitch.checked = true;
    } else {
        disableDarkMode();
        themeSwitch.checked = false;
    }
});

// Apply saved preference; fall back to system preference only on first visit (no saved state)
const savedDarkmode = localStorage.getItem('darkmode');
if (savedDarkmode === 'active') {
    enableDarkMode();
    themeSwitch.checked = true;
} else if (savedDarkmode === null && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    enableDarkMode();
    themeSwitch.checked = true;
} else {
    // Ensures resultsMap (which starts with dark tile) gets swapped to light
    disableDarkMode();
}
