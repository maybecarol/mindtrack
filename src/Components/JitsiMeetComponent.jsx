// src/JitsiMeetComponent.jsx
import React, { useEffect } from 'react';

const JitsiMeetComponent = () => {
    const generateRandomString = () => Math.random().toString(36).substr(2, 10);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://8x8.vc/vpaas-magic-cookie-7bafe0b72aea45628ea0dc08833d2d49/external_api.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const randomRoomId = generateRandomString(); // Generate random room name for each session
            try {
                const api = new window.JitsiMeetExternalAPI('8x8.vc', {
                    roomName: `vpaas-magic-cookie-7bafe0b72aea45628ea0dc08833d2d49/${randomRoomId}`, // Use random room name
                    parentNode: document.getElementById('jitsi-container'),
                    configOverwrite: {
                        disableInviteFunctions: true, // Optional: disable inviting other participants
                    },
                });
            } catch (error) {
                console.error('Failed to initialize Jitsi Meet', error);
            }
        };

        script.onerror = () => {
            console.error('Failed to load Jitsi script');
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []); // Empty dependency array ensures this runs once when component mounts

    return <div id="jitsi-container" style={{ height: '100vh', width: '100%' }} />;
};

export default JitsiMeetComponent;
