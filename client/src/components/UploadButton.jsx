import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './UploadButton.css';

const UploadButton = ({ onImageUpload, onImageRemove }) => {
    const [fileName, setFileName] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [croppingImage, setCroppingImage] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [cropperDimensions, setCropperDimensions] = useState({ height: 400, width: 400 });

    const cropperRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setErrorMessage(null);

        if (file) {
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validMimeTypes.includes(file.type)) {
                setErrorMessage(`Invalid file type: ${file.type}. Please upload a JPEG, JPG or PNG image.`);
                return;
            }

            const extension = file.name.split('.').pop().toLowerCase();
            if (!['jpg', 'jpeg', 'png'].includes(extension)) {
                setErrorMessage(`Invalid file extension: .${extension}. Please upload a JPEG, JPG or PNG image.`);
                return;
            }

            setFileName(file.name);
            setFileType(file.type);
            const imageUrl = URL.createObjectURL(file);
            setCroppingImage(imageUrl);

            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                const { width, height } = img;
                
                const minHeight = 100;
                const minWidth = 200;

                let newHeight = height > width ? 400 : (400 * height) / width;
                let newWidth = height > width ? (400 * width) / height : 400;

                newHeight = Math.max(newHeight, minHeight);
                newWidth = Math.max(newWidth, minWidth);

                setCropperDimensions({ height: newHeight, width: newWidth });
                setIsModalOpen(true);
            };
        } else {
            setErrorMessage('Please upload a JPEG, JPG or PNG image.');
        }
    };

    const handleRemoveImage = (event) => {
        event.stopPropagation();
        setFileName(null);
        setImagePreview(null);
        setErrorMessage(null);
        onImageRemove();
        setCropperDimensions({ height: 400, width: 400 })
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            cropperRef.current.cropper.getCroppedCanvas().toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], fileName, { type: fileType });
                    setImagePreview(URL.createObjectURL(croppedFile));
                    setIsModalOpen(false);
                    onImageUpload(croppedFile);
                }
            }, fileType);
        }
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
            <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''}` })}>
                <input {...getInputProps()} />
                {imagePreview ? (
                    <div className="preview-container">
                        <img src={imagePreview} alt="Selected" className="image-preview" />
                        <button type="button" className="remove-button" onClick={handleRemoveImage}>&times;</button>
                    </div>
                ) : (
                    <p>{isDragActive ? 'Drop the image here...' : 'Drag and drop an image, or click to select one'}</p>
                )}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {fileName && <p id="selectedFile">Selected file: {fileName}</p>}

            {isModalOpen && (
                <div className="modalBackground" onClick={() => setIsModalOpen(false)}>
                    <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
                        <h2>Crop your image</h2>
                        <div className="cropper-container">
                            <Cropper
                                src={croppingImage}
                                style={{
                                    height: cropperDimensions.height,
                                    width: cropperDimensions.width,
                                    backgroundColor: '#2a2a2a',
                                    display: 'block',
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                }}
                                aspectRatio={1}
                                guides={false}
                                ref={cropperRef}
                                viewMode={1}
                                autoCropArea={1}
                                background={false}
                            />
                            <div className="crop-actions">
                                <button className="crop-button" onClick={handleCrop}>Crop</button>
                                <button className="cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

UploadButton.propTypes = {
    onImageUpload: PropTypes.func.isRequired,
    onImageRemove: PropTypes.func,
};

export default UploadButton;
