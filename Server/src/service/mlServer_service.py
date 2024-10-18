import asyncio
from typing import override, AsyncIterator
import generated.mlService_pb2_grpc as ml_grpc
from generated.mlService_pb2 import FileRequest, ClassificationResponse
import grpc
import logging

MAX_MESSAGE_SIZE = 10 * 1024 * 1024  # 10MB


class mlServer(ml_grpc.ImageClassificatorServicer):

    @override
    async def ClassifyFile(self, request_iterator: AsyncIterator[FileRequest], context: grpc.ServicerContext):
        context.set_compression(grpc.Compression.Gzip)
        print(f'Classifying file ')

        file_data = bytearray()
        async for chunk in request_iterator:
            file_data.extend(chunk.file_content)
            if len(file_data) > MAX_MESSAGE_SIZE:
                context.abort(grpc.StatusCode.INVALID_ARGUMENT,
                              'File is too big')

        print(f'File received with {len(file_data)} bytes')
        # Here you should implement the logic to classify the image
        # For now, we will return Dog

        # wait for 3 seconds to simulate the classification
        await asyncio.sleep(3)

        return ClassificationResponse(class_name='Dog', confidence=0.9)
