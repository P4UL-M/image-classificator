python -m grpc_tools.protoc --proto_path=proto -I=proto --python_out=src/generated --grpc_python_out=src/generated --pyi_out=src/generated proto/mlService.proto