python -m grpc_tools.protoc --proto_path=proto -I=proto --python_out=src/generated --grpc_python_out=src/generated --pyi_out=src/generated proto/mlService.proto
sed -i '' 's/^import mlService_pb2 as mlService__pb2/import generated.mlService_pb2 as mlService__pb2/' src/generated/mlService_pb2_grpc.py