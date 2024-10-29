import PropTypes from 'prop-types';
import './ModelDescription.css';

const ModelDescription = ({ name, description, price, accuracy, version }) => {
    return (
        <div className="model-description">
            <h2>{name}</h2>
            <p>{description}</p>
            <ul>
                <li><strong>Price:</strong> {price} token</li>
                <li><strong>Accuracy:</strong> {accuracy?.toFixed(2)}%</li>
                <li><strong>Version:</strong> {version}</li>
            </ul>
        </div>
    );
};

ModelDescription.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    accuracy: PropTypes.number.isRequired,
    version: PropTypes.string.isRequired,
};

export default ModelDescription;