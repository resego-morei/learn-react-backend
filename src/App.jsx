// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState, useEffect } from 'react';
import './App.css';

import PropTypes from 'prop-types';

const Card = ({title}) => {
  const [hasLiked, setHasLiked] = useState(false);
  
  useEffect(() => {
    console.log(`The ${title} component has been liked: ${hasLiked}`);
  }, [hasLiked, title]);
  return (
    <div className="card">
      <h2 className='card-header'>{title}</h2>
      <button onClick={() => setHasLiked(!hasLiked)}>{hasLiked ? 'Liked' : 'Like'}</button>
    </div>
  );
}

const App = () => {
  return (
    <div>
      <h2>Hello</h2>
      <div className='card-container'>
        <Card title = "Kabo"/>
        <Card title = "Resego"/>
        <Card title = "Junior"/>
        <Card title = "Morei"/>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
};

export default App;
