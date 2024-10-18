import React, { useEffect } from 'react';
import Navbar from '../navbar';  // Keep the Navbar if needed in the profile
import MoodTracker from './moodtracker';
import Toolkit from './toolkit';
import Games from './games';
import Music from './music';
import Journaling from './journaling';
import Connect from './connect';
import Footer from '../footer';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, []);

    return (
        <>
            <Navbar />
            <MoodTracker />
            <Toolkit />
            <Games />
            <Music />
            <Journaling />
            <Connect />
            <Footer />
        </>
    );
};

export default Home;
