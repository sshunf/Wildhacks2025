import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
        if (document.getElementById('google-identity-script')) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.id = 'google-identity-script';

        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));

        document.body.appendChild(script);
    });
};

const Auth = () => {
    const navigate = useNavigate();

    const handleGoogleSignIn = (response) => {
        const idToken = response.credential;

        // Send the ID token to the backend for authentication
        fetch('http://localhost:5000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('User signed in:', data);
                alert(`Welcome, ${data.user.username}!`);
                navigate('/survey'); // Redirect to /survey after successful login
            })
            .catch((error) => {
                console.error('Error signing in:', error);
                alert('Sign-In failed. Please try again.');
            });
    };

    useEffect(() => {
        loadGoogleScript()
            .then(() => {
                if (window.google && window.google.accounts) {
                    window.google.accounts.id.initialize({
                        client_id: import.meta.env.VITE_REACT_APP_CLIENT_ID,
                        callback: handleGoogleSignIn,
                    });

                    window.google.accounts.id.renderButton(
                        document.getElementById('google-signin-button'),
                        { theme: 'outline', size: 'large' }
                    );

                    window.google.accounts.id.prompt();
                }
            })
            .catch((error) => {
                console.error('Error loading Google Identity Services script:', error);
            });
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Sign Up / Log In with Google</h1>
            <div id="google-signin-button"></div>
        </div>
    );
};

export default Auth;