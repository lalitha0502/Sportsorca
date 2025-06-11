 ⚽ Upcoming Football Matches Viewer (Single-File Node.js App)

This project fetches and displays upcoming football matches from [Football-Data.org](https://www.football-data.org/). It uses:

- A single **Node.js** server file (`server.js`)
- An embedded **HTML frontend** served from the diff port
- Data is fetched live and filtered to show only **future matches**

 🗂️ Project Structure

For installing dependencies: npm install express axios cors
Run: node server.js
const API_KEY = 'your_api_key_here';

 API key is provided in the code

 Befor running index.html file make sure to run this command

Run : python3 -m http.server 5500
