import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Hero.css'; // Import the CSS file
import superman from '../assets/superman.png';
import soldier from '../assets/soldier.png';
import archer from '../assets/archer.png';

function Hero() {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData')); // Retrieve userData from state

    const selectHero = (hero) => {
        console.log('Selected Hero:', hero);
        navigate('/dashboard', { state: { userData, selectedHero: hero } });
    };

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