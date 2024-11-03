import asyncio
from concurrent import futures
import logging
import colorlog
import os
import grpc

import generated.mlService_pb2_grpc as ml_grpc
from service.mlServer_service import mlServer

handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    '%(asctime)s %(log_color)s%(levelname)s%(reset)s: %(message)s',
    log_colors={
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'bold_red',
    },
    datefmt='%Y-%m-%d %H:%M:%S'
))

logging.basicConfig(level=logging.INFO, handlers=[handler])


async def serve():
    port = int(os.getenv('PORT', 9090))
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    ml_grpc.add_ImageClassificatorServicer_to_server(mlServer(), server)
    server.add_insecure_port(f'[::]:{port}')
    logging.info(f'Starting server on port {port}')
    await server.start()
    logging.info(f'Server listening on port {port}')
    try:
        await server.wait_for_termination()
    except asyncio.CancelledError:
        logging.info("Server stopped")
        await server.stop(0)
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise e

if __name__ == '__main__':
    server = None  # Declare server in outer scope
    try:
        # Run the server and store the server object
        server = asyncio.run(serve())
    except KeyboardInterrupt:
        logging.info("Server stopped by the user")
