import React, { useEffect } from 'react';

const CLIENT_ID = import.meta.env.VITE_REACT_APP_CLIENT_ID;

const loadGoogleScript = () => {
    console.log("Client id: ", CLIENT_ID);
    console.log(import.meta.env)
    return new Promise((resolve, reject) => {
        // Check if the script is already loaded
        if (document.getElementById('google-identity-script')) {
            resolve();
            return;
        }

        // Create the script element
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.id = 'google-identity-script';

        // Resolve the promise when the script is loaded
        script.onload = resolve;

        // Reject the promise if the script fails to load
        script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));

        document.body.appendChild(script);
    });
};

const Auth = () => {
    const handleGoogleSignIn = (response) => {
        const idToken = response.credential;

        console.log('ID Token:', idToken);

        // Send the token to your backend
        fetch('http://localhost:5000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('User signed in:', data);
                alert(`Welcome, ${data.user.name}!`);
            })
            .catch((error) => {
                console.error('Error signing in:', error);
                alert('Sign-In failed. Please try again.');
            });
    };

    useEffect(() => {
        // Load the Google Identity Services script
        loadGoogleScript()
            .then(() => {
                // Initialize Google Sign-In once the script is loaded
                if (window.google && window.google.accounts) {
                    window.google.accounts.id.initialize({
                        client_id: CLIENT_ID, // Replace with your Google Client ID
                        callback: handleGoogleSignIn, // Callback function to handle the response
                    });

                    window.google.accounts.id.renderButton(
                        document.getElementById('google-signin-button'),
                        { theme: 'outline', size: 'large' } // Customize the button
                    );

                    window.google.accounts.id.prompt();
                } else {
                    console.error('Google Identity Services library not loaded.');
                }
            })
            .catch((error) => {
                console.error('Error loading Google Identity Services script:', error);
            });
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Sign Up with Google</h1>
            <div id="google-signin-button"></div>
        </div>
    );
};

export default Auth;