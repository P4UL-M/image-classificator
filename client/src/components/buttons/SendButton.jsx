import './SendButton.css';
import { useState, useContext, useEffect } from 'react';
import { AxiosContext } from '../../providers/AxiosContext';
import PropTypes from 'prop-types';

const SendButton = ({ image, model }) => {
    const { authAxios } = useContext(AxiosContext);
    const [className, setClassName] = useState('');
    const [confidence, setConfidence] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setClassName('');
        setConfidence('');
        setMessage('');
    }, [image, model]);

    const handleSend = async () => {
        if (!image) {
            setMessage('No image selected');
            return;
        }

        if (!image.type.startsWith('image/')) {
            setMessage('Invalid file type. Please upload an image file.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authAxios.post('/classify?' + new URLSearchParams({
                model,
            }), image, {
                headers: {
                    'Content-Type': image.type,
                },
            });

            if (response.status === 200) {
                setClassName(response.data.class_name);
                setConfidence(response.data.confidence);
                setMessage('');
            } else {
                console.log(response);
                throw new Error('Unknown error while trying to classify image');
            }
        } catch (error) {
            if (error.status === 401) {
                setMessage('Unauthorized. Please log in to classify image');
            } else if (error.status <= 500) {
                setMessage('Server error while trying to classify image');
            } else {
                console.log(error);
                setMessage('Unknown error while trying to classify image');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {image && (
                <div className="sendButtonContainer">
                    {!className && !confidence && (
                        <button className="sendButton" onClick={handleSend} disabled={isLoading}>
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                "Send Image"
                            )}
                        </button>
                    )}
                    <div className="message">{message}</div>
                    {className && confidence && (
                        <div className="result">
                            <h2>This image is a {className}</h2>
                            <h3>Confidence: {(confidence * 100).toFixed(2)}%</h3>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

SendButton.propTypes = {
    image: PropTypes.object,
    model: PropTypes.string,
};

export default SendButton;
