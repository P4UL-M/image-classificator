import './HomePage.css';
import frog from '../assets/image_0_frog.png';
import truck1 from '../assets/image_1_truck.png';
import truck2 from '../assets/image_2_truck.png';
import deer from '../assets/image_3_deer.png';
import automobile1 from '../assets/image_4_automobile.png';
import automobile2 from '../assets/image_5_automobile.png';
import bird from '../assets/image_6_bird.png';
import horse from '../assets/image_7_horse.png';
import ship from '../assets/image_8_ship.png';
import cat from '../assets/image_9_cat.png';

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
                    <a href={truck1} download>
                        <img src={truck1} alt="truck" />
                    </a>
                    <p>truck</p>
                </div>
                <div className="image">
                    <a href={truck2} download>
                        <img src={truck2} alt="truck" />
                    </a>
                    <p>truck</p>
                </div>
                <div className="image">
                    <a href={deer} download>
                        <img src={deer} alt="deer" />
                    </a>
                    <p>deer</p>
                </div>
                <div className="image">
                    <a href={automobile1} download>
                        <img src={automobile1} alt="automobile" />
                    </a>
                    <p>automobile</p>
                </div>
                <div className="image">
                    <a href={automobile2} download>
                        <img src={automobile2} alt="automobile" />
                    </a>
                    <p>automobile</p>
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
