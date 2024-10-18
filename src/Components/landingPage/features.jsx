import React from 'react';
import './features.css';

const FeaturesSection = () => {
    return (
        <section className="features-section" id="services">
            <h1 className="features-title">What We Offer</h1>
            <div className="features-grid">
                {/* Mood Tracking */}
                <div className="feature-card">
                    <h3>Daily Mood Tracking</h3>
                    <p>Track how you feel each day and get personalized suggestions based on your emotional state.</p>
                </div>

                {/* Games */}
                <div className="feature-card">
                    <h3>Games</h3>
                    <p>Unwind with stress-relieving games designed to boost your mental clarity and relaxation.</p>
                </div>

                {/* Music */}
                <div className="feature-card">
                    <h3>Music & Podcasts</h3>
                    <p>Listen to music that makes u feel good and explore a variety of podcasts that keep you entertained and motivated.</p>
                </div>

                {/* Journaling */}
                <div className="feature-card">
                    <h3>Journaling</h3>
                    <p>Reflect on your thoughts and experiences with our easy-to-use journaling tool.</p>
                </div>

                {/* Tests for Mental Health */}
                <div className="feature-card">
                    <h3>Tests for Mental Health</h3>
                    <p>Take self-assessment tests for a variety of mental health conditions, including anxiety and depression.</p>
                </div>

                {/* Therapist Connections */}
                <div className="feature-card">
                    <h3>Therapist Connections</h3>
                    <p>Connect with certified mental health professionals for guidance and support.</p>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
