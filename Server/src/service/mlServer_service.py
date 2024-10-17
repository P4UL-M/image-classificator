from typing import override, AsyncIterator
import generated.mlService_pb2_grpc as ml_grpc
from generated.mlService_pb2 import FileRequest, ClassificationResponse
import grpc
import logging


class mlServer(ml_grpc.ImageClassificatorServicer):

    @override
    async def ClassifyFile(self, request_iterator: AsyncIterator[FileRequest], context: grpc.ServicerContext):
        context.set_compression(grpc.Compression.Gzip)
        print(f'Classifying file ')

        file_data = bytearray()
        async for chunk in request_iterator:
            file_data.extend(chunk.file_content)

        print(f'File received with {len(file_data)} bytes')
        # Here you should implement the logic to classify the image
        # For now, we will return Dog

        return ClassificationResponse(class_name='Dog', confidence=0.9)
