import { useState } from 'react';
import './UploadButton.css';
import PropTypes from 'prop-types';

const UploadButton = ({ onImageUpload }) => {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check extension is image
            const extension = file.name.split('.').pop().toLowerCase();
            if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
                alert('Invalid file type. Please upload an image file.');
                return;
            }
            setFileName(file.name);
            onImageUpload(file);
        } else {
            setFileName(null);
        }
    };

    return (
        <>
            <div className="upload-button">
                <label htmlFor="file" className="custom-file-upload">
                    Upload Image
                </label>
                <input type="file" accept="image/*" id="file" onChange={handleFileChange} />
            </div>
            {fileName ? (
                <p id='selectedFile'>Selected file: {fileName}</p>
            ) : (
                <p id='selectedFile'>No file selected</p>
            )}
        </>
    );
};

UploadButton.propTypes = {
    onImageUpload: PropTypes.func,
};

export default UploadButton;