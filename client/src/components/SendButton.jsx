import './SendButton.css';
import { useState, useContext } from 'react';
import { AxiosContext } from '../providers/AxiosContext';
import PropTypes from 'prop-types';

const SendButton = ({ image }) => {
    const { authAxios } = useContext(AxiosContext);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleSend = async () => {
        if (!image) {
            setUploadStatus('No image selected');
            return;
        }

        if (!image.type.startsWith('image/')) {
            setUploadStatus('Invalid file type. Please upload an image file.');
            return;
        }

        try {
            const response = await authAxios.post('/classify', image, {
                headers: {
                    'Content-Type': image.type,
                },
            });
            if (response.status === 200) {
                setUploadStatus('Image uploaded successfully');
            } else {
                setUploadStatus('Error uploading image');
            }
        } catch (error) {
            setUploadStatus('Error uploading image: ' + error.message);
        }
    };

    return (
        <div className="sendButtonContainer">
            <button className="sendButton" onClick={handleSend}>Send Image</button>
            {uploadStatus && (
                <p className={`uploadStatus ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
                    {uploadStatus}
                </p>
            )}
        </div>
    );
};

SendButton.propTypes = {
    image: PropTypes.object,
};

export default SendButton;
