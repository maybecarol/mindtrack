import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar';
import Hero from './Components/landingPage/hero';
import FeaturesSection from './Components/landingPage/features';
import HowItWorks from './Components/landingPage/how';
import Home from './Components/homePage/home'; // Import the User Profile component
import Footer from './components/footer';
import Games from './components/gamesSection/games';
import Journal from './Components/journalSection/journal';
import JitsiMeetComponent from "./Components/JitsiMeetComponent";
import axios from "axios";
import "./App.css";


const CLIENT_ID = "a7c67ee676bd4fe29a8542700da624bd";
const REDIRECT_URI = "http://localhost:5173/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

function App() {

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchType, setSearchType] = useState("artist");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const search = async (e) => {
    e.preventDefault();

    // Ensure token is available
    if (!token) {
      console.log("Token is missing or invalid. Please log in.");
      return;
    }

    try {
      if (searchType === "artist") {
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: searchKey,
            type: "artist",
          },
        });
        setArtists(data.artists.items);
        setPlaylists([]);
      } else {
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: searchKey,
            type: "playlist",
          },
        });
        setPlaylists(data.playlists.items);
        setArtists([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchArtistTracks = async (artistId) => {
    if (!token) {
      console.log("Token is missing or invalid. Please log in.");
      return;
    }

    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            market: "US",
          },
        }
      );
      setCurrentTrack(data.tracks[0]);
    } catch (error) {
      console.error("Error fetching artist tracks:", error);
    }
  };

  const fetchPlaylistTracks = async (playlistId) => {
    if (!token) {
      console.log("Token is missing or invalid. Please log in.");
      return;
    }

    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentTrack(data.items[0].track);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    }
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div
        key={artist.id}
        style={{ margin: "10px", textAlign: "center" }}
        onClick={() => fetchArtistTracks(artist.id)}
      >
        {artist.images.length ? (
          <img
            width="200px"
            height="200px"
            src={artist.images[0].url}
            alt={artist.name}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        ) : (
          <div
            style={{ width: "200px", height: "200px", backgroundColor: "#ddd" }}
          >
            No Image
          </div>
        )}
        <p>{artist.name}</p>
      </div>
    ));
  };

  const renderPlaylists = () => {
    return playlists.map((playlist) => (
      <div
        key={playlist.id}
        style={{ margin: "10px", textAlign: "center" }}
        onClick={() => fetchPlaylistTracks(playlist.id)}
      >
        {playlist.images.length ? (
          <img
            width="200px"
            height="200px"
            src={playlist.images[0].url}
            alt={playlist.name}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        ) : (
          <div
            style={{ width: "200px", height: "200px", backgroundColor: "#ddd" }}
          >
            No Image
          </div>
        )}
        <p>{playlist.name}</p>
      </div>
    ));
  };

  const AudioPlayer = () => {
    const audioRef = React.useRef(null);

    useEffect(() => {
      if (audioRef.current && currentTrack && currentTrack.preview_url) {
        audioRef.current.load();
      }
    }, [currentTrack]);

    if (!currentTrack || !currentTrack.preview_url) {
      return <p>No audio preview available for this track.</p>;
    }

    return (
      <div style={{ marginTop: "20px" }}>
        <h3>
          Now Playing: {currentTrack.name} by{" "}
          {currentTrack.artists.map((artist) => artist.name).join(", ")}
        </h3>
        <audio controls ref={audioRef}>
          <source src={currentTrack.preview_url} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <FeaturesSection />
              <HowItWorks />
              <Footer />
            </>
          } />
          <Route path="/home" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/meet" element={<JitsiMeetComponent />} /> 
        </Routes>
      </Router>
      <div className="App">
        <header className="App-header">
          {!token ? (
            <a
              href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
              style={{ color: "black", fontSize: "20px", textDecoration: "none" }}
            >
              Login to Spotify
            </a>
          ) : (
            <>
              <h2>Welcome! You are logged in.</h2>
              <button onClick={logout} style={{ marginTop: "10px" }}>
                Logout
              </button>
              <form onSubmit={search} style={{ marginTop: "20px" }}>
                <input
                  type="text"
                  placeholder="Search for an artist or playlist"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  style={{ marginRight: "10px", padding: "5px" }}
                />
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  style={{ marginRight: "10px", padding: "5px" }}
                >
                  <option value="artist">Artist</option>
                  <option value="playlist">Playlist</option>
                </select>
                <button type="submit">Search</button>
              </form>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {searchType === "artist" ? renderArtists() : renderPlaylists()}
              </div>
              <AudioPlayer /> {/* add audio player here */}
            </>
          )}
        </header>
      </div>
    </>
  );
}

export default App;


// // export default App;
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from './components/navbar';
// import Hero from './Components/landingPage/hero';
// import FeaturesSection from './Components/landingPage/features';
// import HowItWorks from './Components/landingPage/how';
// import Home from './Components/homePage/home';
// import Games from './components/gamesSection/games';
// import Journal from './Components/journalSection/journal';
// import Music from './components/musicSection/Music';  // Import the new Music component
// import Footer from './components/footer';
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={
//           <>
//             <Navbar />
//             <Hero />
//             <FeaturesSection />
//             <HowItWorks />
//             <Footer />
//           </>
//         } />
//         <Route path="/home" element={<Home />} />
//         <Route path="/games" element={<Games />} />
//         <Route path="/journal" element={<Journal />} />
//         <Route path="/music" element={<Music />} /> {/* Add route for Music */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
