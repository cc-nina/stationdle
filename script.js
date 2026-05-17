const supabaseUrl = window.SUPABASE_URL;
const supabaseKey = window.SUPABASE_KEY;

const { createClient } = supabase;
const _supabase = createClient(supabaseUrl, supabaseKey);

const js_date = new Date();
const year = js_date.getFullYear();
const year_string = year.toString();

const month = js_date.getMonth() + 1;
let month_string = month.toString();
if (month < 10) month_string = '0' + month_string;

const day = js_date.getDate();
let day_string = day.toString();
if (day < 10) day_string = '0' + day_string;

const date = year_string + '-' + month_string + '-' + day_string;
const STORAGE_KEY = 'stationdle-' + date;

function filter() {
    const input = document.getElementById('searchbar').value.toLowerCase();
    document.querySelectorAll('div.station').forEach((el) => {
        const text = el.querySelector('.name').textContent.toLowerCase();
        el.style.display = text.includes(input) ? "flex" : "none";
    });
}

// modal is passed explicitly — no reliance on browser implicit ID→global behavior
function results(guessnum, win, squares, ans, guessesInfo, modal) {
    const UN = new StationIcon({iconUrl: './images/right/un.png'}),
        BR = new StationIcon({iconUrl: './images/right/br.png'}),
        KI = new StationIcon({iconUrl: './images/right/ki.png'}),
        LE = new StationIcon({iconUrl: './images/right/le.png'}),
        LW = new StationIcon({iconUrl: './images/right/lw.png'}),
        MI = new StationIcon({iconUrl: './images/right/mi.png'}),
        RH = new StationIcon({iconUrl: './images/right/rh.png'}),
        ST = new StationIcon({iconUrl: './images/right/st.png'});

    const rightIcons = new Map([
        ["UN", UN], ["BR", BR], ["KI", KI], ["LE", LE],
        ["LW", LW], ["MI", MI], ["RH", RH], ["ST", ST]
    ]);

    const UNx = new StationIcon({iconUrl: './images/wrong/un.png'}),
        BRx = new StationIcon({iconUrl: './images/wrong/br.png'}),
        KIx = new StationIcon({iconUrl: './images/wrong/ki.png'}),
        LEx = new StationIcon({iconUrl: './images/wrong/le.png'}),
        LWx = new StationIcon({iconUrl: './images/wrong/lw.png'}),
        MIx = new StationIcon({iconUrl: './images/wrong/mi.png'}),
        RHx = new StationIcon({iconUrl: './images/wrong/rh.png'}),
        STx = new StationIcon({iconUrl: './images/wrong/st.png'});

    const wrongIcons = new Map([
        ["UN", UNx], ["BR", BRx], ["KI", KIx], ["LE", LEx],
        ["LW", LWx], ["MI", MIx], ["RH", RHx], ["ST", STx]
    ]);

    const attribution = document.getElementsByClassName('leaflet-control-attribution');
    attribution[0].style.display = 'none';
    attribution[1].style.display = 'none';

    let empty = guessnum;
    while (empty < 5) {
        empty++;
        squares += "⬛";
    }

    const correctmsg = "This is " + ans[0].stat_name + " GO Station, the correct station!";
    L.marker([ans[0].point_y, ans[0].point_x], {icon: rightIcons.get(ans[0].line_abbr)})
        .addTo(resultsMap).bindPopup(correctmsg);

    for (let i = 0; i < guessesInfo.length; ++i) {
        const msg = "This is " + guessesInfo[i].stat_name + " GO Station.";
        L.marker([guessesInfo[i].point_y, guessesInfo[i].point_x], {icon: wrongIcons.get(guessesInfo[i].line_abbr)})
            .addTo(resultsMap).bindPopup(msg);
    }

    const shareresults = "Stationdle " + month_string + "/" + day_string + "/" + year_string + "\n\n" + squares + "\n\nhttps://stationdle.vercel.app/";

    let message;
    if (win) {
        message = guessnum === 1
            ? "🐐 Congrats, it took you 1 try!"
            : "🎊 Congrats, it took you " + guessnum + " tries!";
    } else {
        message = "💔 Better luck next time!";
    }

    modal.classList.add("open");

    const modal_inside = document.getElementById("modal-inside");
    const copy_row = document.getElementById("copy_row");

    const desc = document.createElement('h2');
    desc.textContent = message;

    const square_display = document.createElement('p');
    square_display.id = "squareDisplay";
    square_display.innerHTML = squares;

    const tobecopied = document.getElementById('copyText');
    tobecopied.innerHTML = shareresults;
    modal_inside.insertBefore(desc, copy_row);
    modal_inside.insertBefore(tobecopied, copy_row);
    modal_inside.insertBefore(square_display, copy_row);

    if (!win) {
        const revealAns = document.createElement('div');
        revealAns.className = "revealAns";

        const answerwas = document.createElement("h4");
        answerwas.textContent = "The answer was:";

        const div = document.createElement('div');
        div.className = "answer";

        const span = document.createElement('span');
        span.className = "square";
        span.textContent = ans[0].line_abbr;
        span.style.backgroundColor = ans[0].colour;
        div.appendChild(span);

        const name = document.createElement('div');
        name.textContent = ans[0].stat_name;
        name.className = "name";
        div.appendChild(name);

        revealAns.appendChild(answerwas);
        revealAns.appendChild(div);
        modal_inside.insertBefore(revealAns, copy_row);
    }
}

(async () => {
    const { data: num } = await _supabase
        .from('answers')
        .select('station_id')
        .eq('date', date);

    const station_id = num[0].station_id;

    const { data: ans } = await _supabase
        .from('gostations')
        .select('stat_name, line_abbr, point_x, point_y, colour')
        .eq('id', station_id);

    const xcoord = ans[0].point_x;
    const ycoord = ans[0].point_y;

    map.setView(new L.LatLng(ycoord, xcoord), 8);
    resultsMap.setView(new L.LatLng(ycoord, xcoord), 8);

    L.marker([ycoord, xcoord], {icon: ANS}).addTo(map).bindPopup("What station is this?");

    // Single query for all stations — includes x/y so we can skip a separate guesses_info fetch later.
    // Also replaces the separate count query: use stations.length instead.
    const { data: stations } = await _supabase
        .from('gostations')
        .select('stat_name, line_abbr, point_x, point_y, colour')
        .order('id');

    // Derived from already-fetched data — eliminates two extra round-trips (rightline + linecount queries)
    const sameline = stations
        .filter(s => s.line_abbr === ans[0].line_abbr)
        .map(s => s.stat_name);

    const generate_stations = document.getElementById('generatestations');

    for (let i = 0; i < stations.length; i++) {
        const div = document.createElement('div');
        div.className = "station";

        const span = document.createElement('span');
        span.className = "square";
        span.textContent = stations[i].line_abbr;
        span.style.backgroundColor = stations[i].colour;
        div.appendChild(span);

        const name = document.createElement('div');
        name.textContent = stations[i].stat_name;
        name.className = "name";
        div.appendChild(name);

        generate_stations.appendChild(div);
    }

    let gameOver = false;
    let tries_count = 0;
    let squares = "";
    let guessesArr = [];
    let guessNames = [];

    const modal = document.getElementById("modal");
    const settings = document.getElementById("settings");

    // Restore today's game state if it exists
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState) {
        gameOver = savedState.gameOver;
        tries_count = savedState.tries_count;
        guessesArr = savedState.guessesArr;
        guessNames = savedState.guessNames;
        const squaresMapSaved = ["✖️", "🟨", "🟩"];
        if (localStorage.getItem('contrastmode') === 'active') {
            squaresMapSaved[1] = "🟦";
            squaresMapSaved[2] = "🟧";
        }
        squares = savedState.guessesArr.map(g => squaresMapSaved[g]).join("");

        document.querySelectorAll(".station").forEach(button => {
            const btnName = button.querySelector('.name').textContent;
            const idx = savedState.guessNames.indexOf(btnName);
            if (idx === -1) return;
            const result = savedState.guessesArr[idx];
            if (result === 2) {
                button.classList.add("correct");
            } else if (result === 1) {
                button.classList.add("rightline", "disable");
            } else {
                button.classList.add("wrong", "disable");
            }
        });

        if (gameOver) {
            generate_stations.querySelectorAll('.station').forEach(node => node.classList.add("disable"));
            const guessesInfo = savedState.guessNames
                .filter((_, i) => savedState.guessesArr[i] !== 2)
                .map(name => stations.find(s => s.stat_name === name));
            results(tries_count, savedState.win, squares, ans, guessesInfo, modal);
        }
    }

    document.querySelectorAll(".station").forEach(button => {
        button.addEventListener('click', async () => {
            if (gameOver) return;

            const answer = ans[0].stat_name;
            const guess = button.querySelector('.name').textContent;

            if (guess === answer) {
                button.classList.add("correct");
                guessesArr.push(2);
            } else if (sameline.includes(guess)) {
                button.classList.add("rightline", "disable");
                guessesArr.push(1);
            } else {
                button.classList.add("wrong", "disable");
                guessesArr.push(0);
            }

            guessNames.push(guess);
            tries_count += 1;

            if (guess === answer || tries_count === 5) {
                gameOver = true;
                generate_stations.querySelectorAll('.station').forEach(node => node.classList.add("disable"));

                const win = guess === answer;
                if (!win) tries_count++;

                const squaresMap = ["✖️", "🟨", "🟩"];
                if (localStorage.getItem('contrastmode') === 'active') {
                    squaresMap[1] = "🟦";
                    squaresMap[2] = "🟧";
                }

                squares = guessesArr.map(g => squaresMap[g]).join("");

                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    guessNames,
                    guessesArr,
                    tries_count,
                    gameOver: true,
                    win,
                    squares
                }));

                await _supabase
                    .from('statistics')
                    .insert({ ith_guess: tries_count, answer: ans[0].stat_name });

                // Look up guesses in already-fetched stations data — no extra round-trip needed
                const guessesInfo = guessNames
                    .filter((_, i) => guessesArr[i] !== 2)
                    .map(name => stations.find(s => s.stat_name === name));

                results(tries_count, win, squares, ans, guessesInfo, modal);
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    guessNames,
                    guessesArr,
                    tries_count,
                    gameOver: false,
                    win: false,
                    squares: ""
                }));
            }
        });
    });

    const settingsBtn = document.getElementById("settingsBtn");
    const closeSettings = document.getElementById("closesettings");

    settingsBtn.addEventListener("click", () => {
        settings.classList.add("open");
        document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
    });

    closeSettings.addEventListener("click", () => {
        settings.classList.remove("open");
    });

    const closeBtn = document.getElementById("closeModal");
    const copyBtn = document.getElementById("copyResults");

    closeBtn.addEventListener("click", () => {
        document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'block';
        modal.classList.remove("open");
    });

    copyBtn.addEventListener("click", () => {
        const text = document.getElementById('copyText');
        const notif = document.getElementById('notif');
        navigator.clipboard
            .writeText(text.textContent)
            .then(() => { notif.textContent = "Copied!"; })
            .catch(() => { notif.textContent = "Failed to copy!"; });
    });

    document.getElementById('searchbar').addEventListener('keyup', filter);
})();

const map = L.map('map');
map.setZoom(8);

const dark_tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 11.5
});

const light_tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 11.5
});

light_tile.addTo(map);

const resultsMap = L.map('resultsMap');
resultsMap.setZoom(8);

const dark_tile_res = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 11.5
});

const light_tile_res = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 11.5
});

dark_tile_res.addTo(resultsMap);

const StationIcon = L.Icon.extend({
    options: {
        iconSize:    [45, 45],
        iconAnchor:  [27, 45],
        popupAnchor: [-4, -45]
    }
});

const ANS = new StationIcon({iconUrl: './images/ans.png'});
