const { createClient } = supabase
const _supabase = createClient('https://xhtkarqvsqbdzsbpjaox.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodGthcnF2c3FiZHpzYnBqYW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MjMwNjcsImV4cCI6MjA2NjE5OTA2N30.TVXWNlDRTcV_AAlL1QweZtnsOQtoHpZ62eaxbEG508U');

const js_date = new Date()
    
const year = js_date.getFullYear()
const year_string = year.toString()

const month = js_date.getMonth() + 1
let month_string = month.toString()
if (month < 10) {
    month_string = '0' + month_string
}
    
const day = js_date.getDate()
let day_string = day.toString()
if (day < 10) {
    day_string = '0' + day_string
}

const date = year_string + '-' + month_string + '-' + day_string

function filter() {
    let input = document.getElementById('searchbar').value.toString().toLowerCase();
    let stations = document.querySelectorAll('div.station');

    stations.forEach((el) => {
        let text = el.querySelector('.name').textContent.toLowerCase();
        lowerstation = text.toLowerCase();
        el.style.display = text.includes(input) ? "flex" : "none";
    })
}

function results(guessnum, win, squares, ans, guesses) {
    var UN = new StationIcon({iconUrl: './images/right/un.png'}),
        BR = new StationIcon({iconUrl: './images/right/br.png'}),
        KI = new StationIcon({iconUrl: './images/right/ki.png'}),
        LE = new StationIcon({iconUrl: './images/right/le.png'}),
        LW = new StationIcon({iconUrl: './images/right/lw.png'}),
        MI = new StationIcon({iconUrl: './images/right/mi.png'}),
        RH = new StationIcon({iconUrl: './images/right/rh.png'}),
        ST = new StationIcon({iconUrl: './images/right/st.png'})
    

    const rightIcons = new Map()
    rightIcons.set("UN", UN)
    rightIcons.set("BR", BR)
    rightIcons.set("KI", KI)
    rightIcons.set("LE", LE)
    rightIcons.set("LW", LW)
    rightIcons.set("MI", MI)
    rightIcons.set("RH", RH)
    rightIcons.set("ST", ST)

    var UNx = new StationIcon({iconUrl: './images/wrong/un.png'}),
        BRx = new StationIcon({iconUrl: './images/wrong/br.png'}),
        KIx = new StationIcon({iconUrl: './images/wrong/ki.png'}),
        LEx = new StationIcon({iconUrl: './images/wrong/le.png'}),
        LWx = new StationIcon({iconUrl: './images/wrong/lw.png'}),
        MIx = new StationIcon({iconUrl: './images/wrong/mi.png'}),
        RHx = new StationIcon({iconUrl: './images/wrong/rh.png'}),
        STx = new StationIcon({iconUrl: './images/wrong/st.png'})

    const wrongIcons = new Map()
    wrongIcons.set("UN", UNx)
    wrongIcons.set("BR", BRx)
    wrongIcons.set("KI", KIx)
    wrongIcons.set("LE", LEx)
    wrongIcons.set("LW", LWx)
    wrongIcons.set("MI", MIx)
    wrongIcons.set("RH", RHx)
    wrongIcons.set("ST", STx)

    const attribution = document.getElementsByClassName('leaflet-control-attribution')
    attribution[0].style.display = 'none'
    attribution[1].style.display = 'none'

    var empty = guessnum
    while (empty < 5) {
        empty++
        squares += "⬛"
    }

    const correctmsg = "This is "+ans[0].stat_name+" GO Station, the correct station!"
    L.marker([ans[0].point_y, ans[0].point_x], {icon: rightIcons.get(ans[0].line_abbr)}).addTo(resultsMap).bindPopup(correctmsg);
    const guessesLen = guesses.length
    
    for (let i = 0; i < guessesLen; ++i) {
        var curStation = guesses[i].stat_name
        const msg = "This is "+curStation+" GO Station."
        L.marker([guesses[i].point_y, guesses[i].point_x], {icon: wrongIcons.get(guesses[i].line_abbr)}).addTo(resultsMap).bindPopup(msg);
    }

    var shareresults = "Stationdle "+month_string+"/"+day_string+"/"+year_string+"\n\n"+squares+"\n\nhttps://stationdle.vercel.app/"

    if (win) {
        if (win && guessnum === 1) {
            message = "🐐 Congrats, it took you "+guessnum.toString()+" try!"
        } else {
            message = "🎊 Congrats, it took you "+guessnum.toString()+" tries!"
        } 
    } else {
        message = "💔 Better luck next time!"
    }

    modal.classList.add("open")

    const modal_inside = document.getElementById("modal-inside")
    const copy_row = document.getElementById("copy_row")

    const desc = document.createElement('h2');
    desc.innerHTML = message
    
    const square_display = document.createElement('p')
    square_display.innerHTML = squares

    const tobecopied = document.getElementById('copyText');
    tobecopied.innerHTML = shareresults
    modal_inside.insertBefore(desc, copy_row)
    modal_inside.insertBefore(tobecopied, copy_row)
    modal_inside.insertBefore(square_display, copy_row)

    if (!win) {
        const revealAns = document.createElement('div')
        revealAns.className = "revealAns"

        const answerwas = document.createElement("h4")
        answerwas.innerHTML = "The answer was:"

        const div = document.createElement('div');
        div.className = "answer"

        const span = document.createElement('span');
        span.className = "square";
        span.innerHTML = ans[0].line_abbr;
        span.style.backgroundColor = ans[0].colour;
        div.appendChild(span)

        const name = document.createElement('div');
        name.innerHTML = ans[0].stat_name
        name.className = "name"
        div.appendChild(name)

        revealAns.appendChild(answerwas)
        revealAns.appendChild(div)
        
        modal_inside.insertBefore(revealAns, copy_row)
    }
    }
(async () => {
    const {data:num, err_num} = await _supabase
    .from('answers')
    .select('station_id').eq('date', date)

    const station_id = num[0].station_id
    
    const {data:ans, err_ans} = await _supabase
    .from('gostations')
    .select('stat_name, line_abbr, point_x, point_y, colour')
    .eq('id', station_id)

    const xcoord = ans[0].point_x
    const ycoord = ans[0].point_y

    map.setView(new L.LatLng(ycoord, xcoord), 8);
    resultsMap.setView(new L.LatLng(ycoord, xcoord), 8);

    const marker = L.marker([ycoord, xcoord], {icon: ANS}).addTo(map).bindPopup("What station is this?");

    const {count, error} = await _supabase
    .from('gostations')
    .select('*', { count: 'exact', head: true })

    const {data: stations, err_stations} = await _supabase
    .from('gostations')
    .select('colour, line_abbr, stat_name')
    .order('id')

    const {data: rightline, err_rightline} = await _supabase
    .from('gostations')
    .select('stat_name')
    .eq('line_abbr', ans[0].line_abbr)

    const {count:linecount, err_linecount} = await _supabase
    .from('gostations')
    .select('*', { count: 'exact', head: true })
    .eq('line_abbr', ans[0].line_abbr)

    const sameline = []
    for (let i = 0; i < linecount; ++i) {
        sameline.push(rightline[i].stat_name)
    }

    const generate_stations = document.getElementById('generatestations')

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = "station";	

        const span = document.createElement('span');
        span.className = "square";
        span.innerHTML = `${stations[i].line_abbr}`;
        span.style.backgroundColor = `${stations[i].colour}`;
        span.style
        div.appendChild(span)

        const name = document.createElement('div');
        name.innerHTML = `${stations[i].stat_name}`
        name.className = "name"
        div.appendChild(name)
        generate_stations.appendChild(div)
    }

    var tries_count = 0

    const timeout = 150
    var squares = ""

    const buttons = document.querySelectorAll(".station");
    const guesses = []
    
    buttons.forEach(async button => {
        button.addEventListener('click', async () => {
            var answer = ans[0].stat_name
            const guess = button.childNodes[1].innerHTML

            if (guess === answer) {
                button.classList.add("correct");
                squares += "🟩"
            } else if (sameline.includes(guess)) {
                button.classList.add("rightline");
                button.classList.add("disable");
                squares += "🟨"
                guesses.push(guess)
            } else {
                button.classList.add("wrong");
                button.classList.add("disable");
                squares += "🟥"
                guesses.push(guess)
            }
            tries_count += 1
            if (guess === answer || tries_count === 5) {
                for (let i = 0; i < count; i++) {
                    generate_stations.childNodes[i].classList.add("disable")
                }
                
                if (guess != answer) {
                    tries_count++
                }
                // write tries_count to the database
                const {error} = await _supabase
                .from('statistics')
                .insert({ith_guess: tries_count, answer: ans[0].stat_name})
       
                const {data:guesses_info, err_guesses_info} = await _supabase
                .from('gostations')
                .select('stat_name, line_abbr, point_x, point_y, colour')
                .in('stat_name', guesses)
                
                results(tries_count, guess === answer, squares, ans, guesses_info)
            } 
            })
    })

    const openBtn = document.getElementById("openModal")
    const closeBtn = document.getElementById("closeModal")
    const copyBtn = document.getElementById("copyResults")
    const modal = document.getElementById("modal")
    
    closeBtn.addEventListener("click", () => { 
        document.getElementsByClassName( 'leaflet-control-attribution' )[0].style.display = 'block';
        modal.classList.remove("open");
    });

    copyBtn.addEventListener("click", () => {
        let text = document.getElementById('copyText');
        const notif = document.getElementById('notif')
        navigator.clipboard
        .writeText(text.innerHTML)
        .then(() => {
            notif.innerHTML = "Copied!"
        })
        .catch(() => {
            notif.innerHTML = "Failed to copy!"
        });
    });
})()

const map = L.map('map'); 
map.setZoom(8) 

var dark_tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
subdomains: 'abcd',
maxZoom: 11.5
})

var light_tile = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
subdomains: 'abcd',
maxZoom: 11.5
})

dark_tile.addTo(map)

var resultsMap = L.map('resultsMap'); 
resultsMap.setZoom(8) 

var dark_tile_res = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
subdomains: 'abcd',
maxZoom: 11.5
})

var light_tile_res = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
subdomains: 'abcd',
maxZoom: 11.5
})

dark_tile_res.addTo(resultsMap)

var StationIcon = L.Icon.extend({
            options: {
                iconSize:     [45, 45],
                iconAnchor:   [27, 45],
                popupAnchor:  [-4, -45]
            }
        });

var ANS = new StationIcon({iconUrl: './images/ans.png'})