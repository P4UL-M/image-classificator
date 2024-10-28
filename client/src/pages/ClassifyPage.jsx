import { useState } from 'react';
import UploadButton from '../components/UploadButton';
import SendButton from '../components/SendButton';
import ModelSelector from '../components/ModelSelector';
import './ClassifyPage.css';

const ClassifyPage = () => {
    const [image, setImage] = useState(null);
    const [selectedModel, setSelectedModel] = useState('vgg-3'); // Default model

    const handleImageUpload = (uploadedImage) => {
        setImage(uploadedImage);
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
    };

    return (
        <div className="classify-page">
            <div className="model-selector-wrapper">
                <ModelSelector selectedModel={selectedModel} onSelectModel={handleModelSelect} />
            </div>
            <div style={{alignItems:'center', display:'flex', flexDirection:'column'}}>
                <UploadButton onImageUpload={handleImageUpload} onImageRemove={handleRemoveImage} />
                <SendButton image={image} model={selectedModel} />
            </div>
        </div>
    );
};

export default ClassifyPage;