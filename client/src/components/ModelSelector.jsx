// File: components/ModelSelector.jsx

import PropTypes from "prop-types";
import './ModelSelector.css';

const ModelSelector = ({ selectedModel, onSelectModel, models }) => {
    const modelsList = models || ['vgg-3', 'vgg-5'];

    return (
        <div className="model-selector">
            <select
                id="model"
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
            >
                {modelsList.map((model, index) => (
                    <option key={index} value={model}>
                        {model}
                    </option>
                ))}
            </select>
        </div>
    );
};

ModelSelector.propTypes = {
    selectedModel: PropTypes.string,
    onSelectModel: PropTypes.func,
    models: PropTypes.array,
};

export default ModelSelector;