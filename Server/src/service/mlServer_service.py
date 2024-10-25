import asyncio
import pathlib
from typing import override, AsyncIterator
import generated.mlService_pb2_grpc as ml_grpc
from generated.mlService_pb2 import FileRequest, ClassificationResponse
import grpc
import uuid
import os
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from service.db_service import DBService

MAX_MESSAGE_SIZE = 10 * 1024 * 1024  # 10MB
IMAGE_FOLDER = pathlib.Path('data/images')
MODEL_PATH = os.path.join(pathlib.Path(__file__).parent, 'optimized_vgg_model.h5')

class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']

class mlServer(ml_grpc.ImageClassificatorServicer):
    db = DBService()

    def __init__(self):
        # Load the model when the server starts
        self.model = load_model(MODEL_PATH)
        print("Model loaded successfully.")

    @override
    async def ClassifyFile(self, request_iterator: AsyncIterator[FileRequest], context: grpc.ServicerContext):
        context.set_compression(grpc.Compression.Gzip)
        print(f'Classifying file ')

        # Generate URL for the image with a snowflake algorithm
        image_id = uuid.uuid4()
        file_url = IMAGE_FOLDER / f'{image_id}.jpg'

        # Save the file and read the content
        file_data = bytearray()
        with open(file_url, 'wb+') as f:
            async for chunk in request_iterator:
                file_data.extend(chunk.file_content)
                f.write(chunk.file_content)
                if len(file_data) > MAX_MESSAGE_SIZE:
                    context.abort(
                        grpc.StatusCode.INVALID_ARGUMENT, 'File is too big')

        print(f'File received with {len(file_data)} bytes')

        # Preprocess the image and make a prediction
        predicted_class, confidence = self.classify_image(file_url)

        # Insert the image classification result into the database
        mlServer.db.insert_image({
            'file_url': str(file_url),
            'classification': class_names[predicted_class],
            'confidence': float(confidence)  # Convert to standard Python float
        })

        # Return the result
        return ClassificationResponse(class_name=class_names[predicted_class], confidence=confidence)

    def classify_image(self, image_path):
        """Loads, preprocesses the image, and predicts the class using the loaded model."""
        img = load_img(image_path, target_size=(32, 32))  # Ensure image size matches the model input size
        img_array = img_to_array(img) / 255.0  # Normalize the image
        img_array = tf.expand_dims(img_array, axis=0)  # Add batch dimension

        # Make predictions using the model
        predictions = self.model.predict(img_array)
        
        # Use TensorFlow operations instead of numpy
        predicted_class = tf.math.argmax(predictions, axis=1)[0].numpy()  # Get index of the highest probability class
        confidence = tf.reduce_max(predictions).numpy()  # Get the highest probability

        return predicted_class, confidence

    def __del__(self):
        self.db.__del__()
