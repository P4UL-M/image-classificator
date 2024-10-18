import asyncio
import pathlib
from typing import override, AsyncIterator
import generated.mlService_pb2_grpc as ml_grpc
from generated.mlService_pb2 import FileRequest, ClassificationResponse
import grpc
import uuid

from service.db_service import DBService

MAX_MESSAGE_SIZE = 10 * 1024 * 1024  # 10MB
IMAGE_FOLDER = pathlib.Path('data/images')


class mlServer(ml_grpc.ImageClassificatorServicer):

    db = DBService()

    @override
    async def ClassifyFile(self, request_iterator: AsyncIterator[FileRequest], context: grpc.ServicerContext):
        context.set_compression(grpc.Compression.Gzip)
        print(f'Classifying file ')

        # generate url for the image with a snowflake algorithm
        image_id = uuid.uuid4()
        file_url = IMAGE_FOLDER / f'{image_id}.jpg'

        # save the file and read the content
        file_data = bytearray()
        with open(file_url, 'wb+') as f:
            async for chunk in request_iterator:
                file_data.extend(chunk.file_content)
                f.write(chunk.file_content)
                if len(file_data) > MAX_MESSAGE_SIZE:
                    context.abort(
                        grpc.StatusCode.INVALID_ARGUMENT, 'File is too big')

        print(f'File received with {len(file_data)} bytes')
        # Here you should implement the logic to classify the image
        # For now, we will return Dog

        # wait for 3 seconds to simulate the classification
        await asyncio.sleep(3)

        # insert the image information into the database
        mlServer.db.insert_image({
            'file_url': str(file_url),
            'classification': 'Dog',
            'confidence': 0.9
        })

        # return the result
        return ClassificationResponse(class_name='Dog', confidence=0.9)

    def __del__(self):
        self.db.__del__()
