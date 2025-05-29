const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5501;

app.use(cors());

const API_URL = 'https://api.football-data.org/v4/matches';
const API_KEY = '2253f8bb6aeb4e2a9dba87fa744b9b77'; // Replace if needed

app.get('/api/matches', async (req, res) => {
  try {
    console.log('\n[1] Fetching matches from API...');
    const response = await axios.get(API_URL, {
      headers: { 'X-Auth-Token': API_KEY }
    });

    const now = new Date();
const nowUTC = new Date(now.toISOString());
    console.log(`\n[2] Current server time: ${now.toISOString()}`);
    console.log(`[3] Local time: ${now.toString()}`);

    // Debug: Print all matches with time analysis
   const upcomingMatches = response.data.matches.filter(match => {
  const matchDate = new Date(match.utcDate);
  return matchDate > now;
});

// Log only upcoming matches
console.log(`\n[4] Upcoming Matches (${upcomingMatches.length} found):`);
upcomingMatches.forEach((match, index) => {
  const matchDate = new Date(match.utcDate);
  console.log(`\nMatch ${index + 1}:`);
  console.log(`- Teams: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
  console.log(`- UTC Date: ${match.utcDate}`);
  console.log(`- Local Date: ${matchDate.toString()}`);
  console.log(`- Status: ${match.status}`);
});

    // More inclusive filtering
 
   const matches = response.data.matches.filter(match => {
  const matchDate = new Date(match.utcDate); // already in UTC
  return matchDate > nowUTC;
})
      .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
      .map(match => ({
        ...match,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        date: match.utcDate,
        competition: match.competition.name,
        status: match.status,
        isFuture: new Date(match.utcDate) > now
      }));

    console.log(`\n[5] Filtered to ${matches.length} matches:`);
    console.log(matches);

    if (matches.length === 0) {
      console.warn('\n[WARNING] No matches found. Possible reasons:');
      console.warn('- API returned only finished matches');
      console.warn('- Timezone mismatch between server and API');
      console.warn('- No scheduled matches in the API response');
      console.warn('- API key restrictions');
    }

    res.json(matches.length > 0 ? matches : { 
      warning: "No upcoming matches found",
      rawData: response.data.matches,
      serverTime: now.toISOString()
    });

  } catch (error) {
    console.error('\n[ERROR] API Request Failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'API request failed',
      details: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`Try these endpoints:`);
  console.log(`- http://localhost:${PORT}/api/matches`);
  console.log(`- Direct API test: curl -H "X-Auth-Token: ${API_KEY}" "${API_URL}"`);
});