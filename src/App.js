import React from 'react';
import Navbar from './components/navbar/navbar';
import Banner from './components/Banner/Banner';
import RowPost from './components/RowPost/RowPost';
import { originals,action, comedy, horror } from './urls';
import './App.css';
function App() {
  return (
    <div className='app'>
      <Navbar />
      <Banner />
      <RowPost urls={originals} title='Netflix Originals'/>
      <RowPost urls={action} title='Action' isSmall/>
      <RowPost urls={comedy} title='Comedy' isSmall/>
      <RowPost urls={horror} title='Horror' isSmall/>
    </div>
  );
}

export default App;
