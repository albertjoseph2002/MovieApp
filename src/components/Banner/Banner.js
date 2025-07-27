import React, { useEffect, useState } from 'react'
import { API_KEY,imageurl } from '../../constants/constants';
import axios from '../../axios';
import './Banner.css';
function Banner() {
  const [movie, setMovie] = useState();
  useEffect(() => {
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`).then((Response)=>{
      // console.log(Response.data.results);
      const randomIndex = Math.floor(Math.random() * Response.data.results.length);
      setMovie(Response.data.results[randomIndex]);
    })
  }, []);
  return (
    <div style={{backgroundImage:`url(${movie ? imageurl+movie.backdrop_path:""})`}}
    className='banner'>
  
        <div className='content'>
            <h1 className='title'>{movie ? movie.title:"nothing"}</h1>
            <div className='buttons'>
                <button className='button'>Play</button>
                <button className='button'>My List</button>
            </div>
            <h1 className='description'>{movie? movie.overview:"nothing"}</h1>
            
      
        </div>
        <div className="fade_bottom"></div>
    </div>
  )
}

export default Banner
