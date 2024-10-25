import './HomePage.css';
import frog from '../assets/frog.png';
import truck from '../assets/truck.png';
import deer from '../assets/deer.png';
import automobile from '../assets/automobile.png';
import bird from '../assets/bird.png';
import horse from '../assets/horse.png';
import ship from '../assets/ship.png';
import airplane from '../assets/airplane.png';
import cat from '../assets/cat.png';
import dog from '../assets/dog.png';

const HomePage = () => {
    return (
        <div className="home-page">
            <h1>Welcome to Image Classificator</h1>
            <p className="description">
                This application allows you to upload an image. Once you are logged in, our server will classify the image and return what it identifies it as. 
                You can explore various classifications, making it easier to understand different objects and animals.
            </p>
            <div className="images">
                <div className="image">
                    <a href={frog} download>
                        <img src={frog} alt="frog" />
                    </a>
                    <p>frog</p>
                </div>
                <div className="image">
                    <a href={truck} download>
                        <img src={truck} alt="truck" />
                    </a>
                    <p>truck</p>
                </div>
                <div className='image'>
                    <a href={dog} download>
                        <img src={dog} alt="dog" />
                    </a>
                    <p>dog</p>
                </div>
                <div className="image">
                    <a href={deer} download>
                        <img src={deer} alt="deer" />
                    </a>
                    <p>deer</p>
                </div>
                <div className="image">
                    <a href={automobile} download>
                        <img src={automobile} alt="automobile" />
                    </a>
                    <p>automobile</p>
                </div>
                <div className="image">
                    <a href={airplane} download>
                        <img src={airplane} alt="airplane" />
                    </a>
                    <p>airplane</p>
                </div>
                <div className="image">
                    <a href={bird} download>
                        <img src={bird} alt="bird" />
                    </a>
                    <p>bird</p>
                </div>
                <div className="image">
                    <a href={horse} download>
                        <img src={horse} alt="horse" />
                    </a>
                    <p>horse</p>
                </div>
                <div className="image">
                    <a href={ship} download>
                        <img src={ship} alt="ship" />
                    </a>
                    <p>ship</p>
                </div>
                <div className="image">
                    <a href={cat} download>
                        <img src={cat} alt="cat" />
                    </a>
                    <p>cat</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
