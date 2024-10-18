import React, { useState, useEffect } from 'react';
import snakeImg from '../../assets/images/snake.png';
import shooterImg from '../../assets/images/shooter.png';
import candyImg from '../../assets/images/candy.jpg';
import bubbleImg from '../../assets/images/bubble.png';
import { useNavigate } from 'react-router-dom';
import './games.css'; // Import your CSS file

const Games = () => {
  const images = [
    { src: snakeImg, alt: 'Snake Game' },
    { src: shooterImg, alt: 'Spaceship Game' },
    { src: candyImg, alt: 'Candy Crush Game' },
    { src: bubbleImg, alt: 'Bubble Shooter Game' }
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const getCarouselClass = (index) => {
    if (index === currentImage) {
      return 'carousel-item active';
    }
    if (index === (currentImage + 1) % images.length) {
      return 'carousel-item next';
    }
    if (index === (currentImage - 1 + images.length) % images.length) {
      return 'carousel-item prev';
    }
    return 'carousel-item';
  };

  const navigate = useNavigate();

  return (
    <section className="games">
      <div className="games-content">
        <h2>Games</h2>
        <p>
          Enjoy a variety of games designed to provide relaxation and mental stimulation. Play classics like Snake, battle waves of aliens, or match candies in a fun, engaging way.
        </p>
        <button onClick={() => navigate('/games')}>Play Games</button>
      </div>
      <div className="carousel">
        {images.map((image, index) => (
          <div key={index} className={getCarouselClass(index)}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Games;
