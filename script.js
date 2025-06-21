let accessToken = null;

async function getToken() {
  const hash = window.location.hash;

  if (!hash) {
    const CLIENT_ID = "84d0f74904cd4f26a11629ae2f4a50ef";
    const REDIRECT_URI = "http://127.0.0.1:5500/callback.html";
    const SCOPES = [
      "user-read-playback-state",
      "user-modify-playback-state",
      "streaming",
    ];
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES.join("%20")}`;
    
    window.location.href = AUTH_URL;
  } else {
    const params = new URLSearchParams(hash.substring(1));
    accessToken = params.get("access_token");
  }
}

async function callSpotify(endpoint, method = "POST") {
  if (!accessToken) return alert("Not authorized.");
  await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
    method,
    headers: { Authorization: "Bearer " + accessToken },
  });
}

function prevTrack() {
  callSpotify("previous");
}

function nextTrack() {
  callSpotify("next");
}

function togglePlay() {
  fetch("https://api.spotify.com/v1/me/player", {
    headers: { Authorization: "Bearer " + accessToken }
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.is_playing) {
        callSpotify("pause");
      } else {
        callSpotify("play");
      }
    });
}

getToken();
