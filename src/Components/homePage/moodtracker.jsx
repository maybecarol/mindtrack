import React, { useState } from 'react';
// Import the image - import moodImage from '../../assets/images/mood.jpg';
import './moodtracker.css'; // Import your CSS file

const MoodTracker = () => {
  const [message, setMessage] = useState('');

  // Define messages for each emotion
  const emotionMessages = {
    Happy: "Awesome! Your happiness is contagious!",
    Sad: "Oh no, hope things get better soon!",
    Depressed: "It's okay, take it one step at a time.",
    Angry: "Take a deep breath, it will help.",
    Excited: "Awesome! Keep that energy going!",
    Stressed: "Relax, take a break, you'll get through this.",
    Crying: "It's okay to cry, let it all out.",
  };

  const handleEmojiClick = (emotion) => {
    setMessage(emotionMessages[emotion]);
  };

  return (
    <section className="mood-tracker">
      {/* <div className="mood-image">
        <img src={moodImage} alt="Mood Tracking" />
      </div> */}
      <div className="mood-content">
        <h1>How Are You Feeling Today?</h1>
        <p>Check in with your emotions daily, track patterns over time and discover what drives your mood.</p>
      </div>
      <div>
        <div className="emoji-container">
          <div className="emoji-wrapper" onClick={() => handleEmojiClick('Happy')}>
            <span className="emoji" role="img" aria-label="happy">😊</span>
            <p className="emoji-label">Happy</p>
          </div>
          <div className="emoji-wrapper" onClick={() => handleEmojiClick('Sad')}>
            <span className="emoji" role="img" aria-label="sad">😢</span>
            <p className="emoji-label">Sad</p>
          </div>
          <div className="emoji-wrapper" onClick={() => handleEmojiClick('Depressed')}>
            <span className="emoji" role="img" aria-label="depressed">😔</span>
            <p className="emoji-label">Depressed</p>
          </div>
          <div className="emoji-wrapper" onClick={() => handleEmojiClick('Angry')}>
            <span className="emoji" role="img" aria-label="angry">😠</span>
            <p className="emoji-label">Angry</p>
          </div>
          <div className="emoji-wrapper" onClick={() => handleEmojiClick('Excited')}>
            <span className="emoji" role="img" aria-label="excited">🤩</span>
            <p className="emoji-label">Excited</p>
          </div>
          <div className="emoji-wrapper" onClick={() => handleEmojiClick('Stressed')}>
            <span className="emoji" role="img" aria-label="stressed">😰</span>
            <p className="emoji-label">Stressed</p>
          </div>
          <div className="emoji-wrapper" onClick={() => handleEmojiClick('Crying')}>
            <span className="emoji" role="img" aria-label="crying">😭</span>
            <p className="emoji-label">Crying</p>
          </div>
        </div>
        <div className="message">{message}</div>
      </div>
    </section>
  );
};

export default MoodTracker;
