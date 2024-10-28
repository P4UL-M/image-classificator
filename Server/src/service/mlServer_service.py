import logging
import pathlib
from typing import AsyncIterator
import generated.mlService_pb2_grpc as ml_grpc
from generated.mlService_pb2 import FileRequest, ClassificationResponse
import grpc
import uuid
import os
import tensorflow as tf
from keras import models as keras_models
from keras import preprocessing
from service.db_service import DBService
from config import DEFAULT_ML_MODEL, IMAGE_DIR, ML_MODELS_DIR, MAX_MESSAGE_SIZE, ML_MODELS

class mlServer(ml_grpc.ImageClassificatorServicer):
    db = DBService()

    def __init__(self):
        # Load all models from the ML_MODELS_DIR
        self.models: dict[str, keras_models.Model] = {}
        for model in ML_MODELS:
            model_path = ML_MODELS_DIR / model['file']
            logging.info(f"Loading model {model_path}")
            self.models[model['name']] = keras_models.load_model(model_path)
        logging.info("Models loaded")

    async def ClassifyFile(self, request_iterator: AsyncIterator[FileRequest], context: grpc.ServicerContext):
        context.set_compression(grpc.Compression.Gzip)
        logging.info("ClassifyFile method started")

        # Generate URL for the image with a snowflake algorithm
        image_id = uuid.uuid4()
        file_url = IMAGE_DIR / f'{image_id}.jpg'
        model_name = DEFAULT_ML_MODEL

        # Save the file and read the content
        file_data = bytearray()
        with open(file_url, 'wb+') as f:
            async for chunk in request_iterator:
                if (chunk.model_name):
                    model_name = chunk.model_name
                    continue
                file_data.extend(chunk.file_content)
                f.write(chunk.file_content)
                if len(file_data) > MAX_MESSAGE_SIZE:
                    context.abort(grpc.StatusCode.INVALID_ARGUMENT, 'File is too big')

        # Get the model to use
        model_config = next((m for m in ML_MODELS if m['name'] == model_name), None)
        if not model_config:
            logging.error(f"Model {model_name} not found")
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, 'Model not found')

        # Preprocess the image and make a prediction
        predicted_class, confidence = self.classify_image(model_config, file_url)

        # Insert the image classification result into the database
        mlServer.db.insert_image({
            'file_url': str(file_url),
            'classification': model_config['classes'][predicted_class],
            'confidence': float(confidence),  # Convert to standard Python float
            'model_name': model_name
        })

        # Return the result
        return ClassificationResponse(class_name=model_config['classes'][predicted_class], confidence=confidence)

    def classify_image(self, model_config:dict, image_path:pathlib.Path):
        """Loads, preprocesses the image, and predicts the class using the loaded model."""
        img = preprocessing.image.load_img(image_path, target_size=model_config['preprocessing']['resize']
                       )  # Ensure image size matches the model input size
        img_array = preprocessing.image.img_to_array(img) * model_config['preprocessing']['normalize']
        img_array = tf.expand_dims(img_array, axis=0)  # Add batch dimension

        # Make predictions using the model
        predictions = self.models[model_config['name']].predict(img_array)

        # Use TensorFlow operations instead of numpy
        # Get index of the highest probability class
        predicted_class = tf.math.argmax(predictions, axis=1)[0].numpy()
        # Get the highest probability
        confidence = tf.reduce_max(predictions).numpy()

        return predicted_class, confidence

    def __del__(self):
        self.db.__del__()
