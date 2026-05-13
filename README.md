# Stationdle

A daily guessing game for GO Transit stations in the Greater Toronto Area. Inspired by Wordle.

**[Play it here](https://stationdle.vercel.app/)**

## How to play

A GO station is pinned on the map. You have 5 guesses to identify it.

- **Green** — correct station
- **Yellow** — wrong station, but on the same GO line
- **Grey** — wrong station, different line

After the game ends, a results map shows where your guesses and the answer were located. Share your score with the emoji grid.

A new station is picked every day.

## Stack

- [Leaflet.js](https://leafletjs.com/) — interactive maps
- [Supabase](https://supabase.com/) — daily answers and guess statistics
- [Vercel](https://vercel.com/) — hosting

