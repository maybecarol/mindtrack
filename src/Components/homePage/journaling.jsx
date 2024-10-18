import React from 'react';
import './journaling.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const Journaling = () => {
  const navigate = useNavigate();
  
  return (
    <section className="journaling">
      <h1>Journaling</h1>
      <p>Reflect on your thoughts and feelings with our journaling tool. Keep track of your mental wellness journey and explore your personal growth.</p>
      <div className="journaling-buttons">
        <button onClick={() => navigate('/journal')}>Start Journaling</button>
      </div>
    </section>
  );
};

export default Journaling;
