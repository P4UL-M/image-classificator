import { useCallback, useContext, useEffect, useState } from 'react';
import UploadButton from '../components/UploadButton';
import SendButton from '../components/SendButton';
import ModelSelector from '../components/ModelSelector';
import './ClassifyPage.css';
import { AxiosContext } from '../providers/AxiosContext';
import ModelDescription from '../components/ModelDescription';

const ClassifyPage = () => {
    const { publicAxios } = useContext(AxiosContext);
    const [image, setImage] = useState(null);
    const [selectedModel, setSelectedModel] = useState('vgg-3'); // Default model
    const [models, setModels] = useState([]);

    const handleImageUpload = (uploadedImage) => {
        setImage(uploadedImage);
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
    };

    const fetchModels = useCallback(async () => {
        try {
            const response = await publicAxios.get('/models');
            return response.data.models;
        } catch (error) {
            console.log(error);
            return [];
        }
    }, [publicAxios]);

    useEffect(() => {
        fetchModels().then((models) => {
            console.log(models);
            setModels(models);
        });
    }, [fetchModels]);

    return (
        <div className="classify-page">
            <div className='left-drawer'>
                <div className="model-selector-wrapper">
                    <ModelSelector selectedModel={selectedModel} onSelectModel={handleModelSelect} models={models?.map(model => model.name)} />
                </div>
            <ModelDescription {...models.find(model => model.name === selectedModel)} />
            </div>
            <div className='content'>
                <UploadButton onImageUpload={handleImageUpload} onImageRemove={handleRemoveImage} />
                <SendButton image={image} model={selectedModel} />
            </div>
        </div>
    );
};

export default ClassifyPage;