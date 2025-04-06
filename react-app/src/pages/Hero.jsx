import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import '../css/Hero.css'; // Import the CSS file
import superman from '../assets/superman.png';
import soldier from '../assets/soldier.png';
import archer from '../assets/archer.png';


function Hero() {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData')); // Retrieve userData from state
    const [loading, setLoading] = React.useState(true); // Loading state

    console.log('User Data:', userData); // Debug userData

    // Fetch the selected hero from the backend
    const getSelectedHero = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/hero/${userData._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to fetch selected hero');
            }

            const data = await response.json();
            console.log('Fetched Hero ID:', data.hero_id);

            // If hero_id is not -1, navigate to the dashboard
            if (data.hero_id !== -1) {
                navigate('/dashboard', { state: { userData, heroId: data.hero_id } });
            }
        } catch (error) {
            console.error('Error fetching selected hero:', error);
        } finally {
            setLoading(false); // Stop loading after the fetch is complete
        }
    };

    const selectHero = async (hero) => {
        const heroIdMap = {
            'Superman' : 0,
            'Soldier' : 1,
            'Archer' : 2,
        };

        const heroId = heroIdMap[hero]; // Map hero name to hero ID
        console.log('Selected Hero:', hero, 'Hero ID:', heroId);

        try {
            // Call the updateHero backend endpoint
            const response = await fetch(`http://localhost:5000/api/users/hero/${userData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hero_id: heroId }),
            });

            if (!response.ok) {
                throw new Error('Failed to update hero');
            }

            console.log('Hero updated successfully');
            navigate('/dashboard', { state: { userData, heroId } });
        } catch (error) {
            console.error('Error updating hero:', error);
            alert('Failed to update hero. Please try again.');
        }
    };

    // Call getSelectedHero when the component loads
    React.useEffect(() => {
        if (userData?._id) {
            getSelectedHero();
        } else {
            console.error('User ID is missing');
        }
    }, [userData]);

    if (loading) {
        return <div>Loading...</div>; // Show a loading message or spinner
    }

    return (
        <div className="hero-container">
            <h1 className="hero-title">Choose Your Hero</h1>
            <div className="hero-images">
                <img
                    src={superman}
                    alt="Superman"
                    className="hero-image"
                    onClick={() => selectHero('Superman')}
                />
                <img
                    src={soldier}
                    alt="Soldier"
                    className="hero-image"
                    onClick={() => selectHero('Soldier')}
                />
                <img
                    src={archer}
                    alt="Archer"
                    className="hero-image"
                    onClick={() => selectHero('Archer')}
                />
            </div>
        </div>
    );
}

export default Hero;