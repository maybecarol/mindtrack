import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './how.css';

const HowItWorks = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false); // State to toggle between login and signup
    const [error, setError] = useState(''); // State for error messages

    // Password validation function
    const validatePassword = (password) => {
        // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        setError(''); // Reset error message before each attempt

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return; // Exit the function if password validation fails
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/home'); // Redirect to profile page after successful signup
            } else {
                setError(data.message); // Set error message from response
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Signup failed. Please try again.'); // Generic error message
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(''); // Reset error message before each attempt
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/home'); // Redirect to profile page after successful login
            } else {
                setError(data.message); // Set error message from response
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Login failed. Please try again.'); // Generic error message
        }
    };

    return (
        <div className="signup-and-how-it-works" id="about">
            <div className="signup-form">
                <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
                <form onSubmit={isLogin ? handleLogin : handleSignup}>
                    {!isLogin && (
                        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
                    )}
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />

                    {error && <p className="error-message">{error}</p>} {/* Display error message */}

                    <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
                    <p>OR</p>
                    <button className="google-login" type="button">Continue with Google</button>
                </form>
                <p>
                    {isLogin ? "Don't have an account?" : "Already a member?"}
                    <a href="#about" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? ' Sign Up' : ' Log In'}
                    </a>
                </p>
            </div>

            <div className="how-it-works">
                <h1 className="section-title">How It Works</h1>
                <p>
                    At MindTrack, we aim to support your mental well-being through a range of engaging features.
                    Start by signing up for a free account, which allows you to track your mood daily.
                    By logging your emotions, you gain valuable insights into your mental health patterns.
                </p>
                <p>
                    Explore our diverse resources, including relaxing games, journaling tools, and guided exercises that promote self-reflection and relaxation.
                    You can also take self-assessment tests to better understand your emotional state.
                    These assessments are designed to provide insights, not diagnoses, and it's essential to consult a qualified mental health professional for any diagnostic purposes.
                </p>
                <p>
                    If you require further support, our platform connects you with certified therapists who can offer personalized guidance tailored to your needs.
                    Additionally, our AI chatbot is available to provide instant advice and tips for managing your mental health on the go.
                </p>
            </div>
        </div>
    );
};

export default HowItWorks;
