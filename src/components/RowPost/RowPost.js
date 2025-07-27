import React, { useEffect, useState } from 'react';
import './RowPost.css';
import { imageurl, API_KEY } from '../../constants/constants'; // Make sure to import or define API_KEY
import axios from '../../axios';
import YouTube from 'react-youtube';

function RowPost(props) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState('');

  // Fetch movies for the row when the component mounts
  useEffect(() => {
    axios.get(props.urls)
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch(err => {
        console.error("Error fetching movies:", err);
        setError('Failed to load movies.');
      });
  }, [props.urls]); // Dependency array ensures this runs only when the URL prop changes

  // Options for the react-youtube player
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1, // Autoplay the video when the popup opens
    },
  };

  // Function to handle clicking on a movie poster
  const handleMovieClick = (movie) => {
    const id = movie.id;
    // TV shows use 'name', movies use 'title'. This helps determine the media type.
    const mediaType = movie.title ? 'movie' : 'tv';

    console.log(`Fetching trailer for ${mediaType} ID: ${id}`);
    setError(''); // Clear previous errors

    // Fetch video data for the selected movie or TV show
    axios.get(`/${mediaType}/${id}/videos?api_key=${API_KEY}&language=en-US`)
      .then(response => {
        if (response.data.results.length !== 0) {
          // Find the official trailer from the results
          const officialTrailer = response.data.results.find(video => video.type === 'Trailer');
          if (officialTrailer) {
            setTrailerUrl(officialTrailer.key);
            setIsPopupOpen(true); // Open the popup or keep it open if it's already open
          } else {
            // Handle case where there are videos, but no official trailer
            console.log('No official trailer found for this item.');
            closePopup(); // Close the popup if no trailer is found for the new item
            setError('No official trailer available for this selection.');
          }
        } else {
          console.log('No video trailers found for this item.');
          closePopup(); // Close the popup if no trailer is found
          setError('No trailers available for this selection.');
        }
      })
      .catch(err => {
        console.error("Error fetching trailer:", err);
        closePopup(); // Close the popup on error
        setError('Could not fetch trailer. Please try again later.');
      });
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setTrailerUrl(''); // Clear the URL so the video stops
  };

  return (
    <div className='row'>
      <h2 className='row-title'>{props.title}</h2>
      <div className='posters'>
        {movies.map((obj) => (
          <div key={obj.id} className='poster-container' onClick={() => handleMovieClick(obj)}>
            <img
              src={`${imageurl}${obj.backdrop_path}`}
              alt={obj.title || obj.name || "Movie Poster"}
              className={props.isSmall ? 'small_poster' : 'poster'}
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/141414/FFFFFF?text=Image+Not+Found"; }}
            />
            {/* Title overlay that appears on hover */}
            <p className='poster-title'>{obj.title || obj.name}</p>
          </div>
        ))}
      </div>

      {/* Error Message Display */}
      {error && <p className='error-message'>{error}</p>}

      {/* Popup Modal for YouTube Player */}
      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>&times;</button>
            {trailerUrl && <YouTube opts={opts} videoId={trailerUrl} onReady={(e) => e.target.playVideo()} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default RowPost;