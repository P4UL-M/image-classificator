import { useState } from 'react';
import './UploadButton.css';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const UploadButton = ({ onImageUpload, onImageRemove }) => {
    const [fileName, setFileName] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const validMimeTypes = ['image/jpeg', 'image/png'];
            if (!validMimeTypes.includes(file.type)) {
                console.warn(`Skipped "${file.name}" because it is not a valid MIME type: ${file.type}`);
                return;
            }

            const extension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['jpg', 'jpeg', 'png'];
            if (!validExtensions.includes(extension)) {
                console.warn(`Skipped "${file.name}" because an invalid file extension was provided: .${extension}`);
                return;
            }

            setFileName(file.name);
            setImagePreview(URL.createObjectURL(file));
            onImageUpload(file);
        }
    };

    const handleRemoveImage = (event) => {
        event.stopPropagation();
        setFileName(null);
        setImagePreview(null);
        onImageRemove();
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        maxFiles: 1,
    });

    return (
        <div className="dropzone-container">
            <div
                {...getRootProps({
                    className: `dropzone ${isDragActive ? 'active' : ''}`,
                })}
            >
                <input {...getInputProps()} />
                {imagePreview ? (
                    <div className="preview-container">
                        <img src={imagePreview} alt="Selected" className="image-preview" />
                        <button
                            type="button"
                            className="remove-button"
                            onClick={handleRemoveImage}
                        >
                            &times; {/* "X" symbol */}
                        </button>
                    </div>
                ) : (
                    <p>{isDragActive ? 'Drop the image here...' : 'Drag and drop an image, or click to select one'}</p>
                )}
            </div>
            {fileName && (
                <p id="selectedFile">Selected file: {fileName}</p>
            )}
        </div>
    );
};

UploadButton.propTypes = {
    onImageUpload: PropTypes.func.isRequired,
    onImageRemove: PropTypes.func,
};

export default UploadButton;
