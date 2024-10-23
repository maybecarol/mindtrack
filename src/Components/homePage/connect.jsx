import React from 'react';
import './connect.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const Connect = () => {
  const navigate = useNavigate();

  return (
    <section className="connect">
      <h1>Connect with Therapists</h1>
      <p>Find and connect with licensed therapists for professional guidance and support. Access various resources to help you on your mental health journey.</p>
      <div className="connect-buttons">
        <button onClick={() => navigate('/meet')}>Find a Therapist</button>
      </div>
    </section>
  );
};

export default Connect;
