import React, { useState } from 'react';
import './UploadButton.css';

const UploadButton = () => {
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
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

export default UploadButton;