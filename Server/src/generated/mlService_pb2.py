# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: mlService.proto
# Protobuf Python Version: 5.27.2
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    27,
    2,
    '',
    'mlService.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0fmlService.proto\x12\x12imageclassificator\"C\n\x0b\x46ileRequest\x12\x16\n\x0c\x66ile_content\x18\x01 \x01(\x0cH\x00\x12\x14\n\nmodel_name\x18\x02 \x01(\tH\x00\x42\x06\n\x04\x66ile\"@\n\x16\x43lassificationResponse\x12\x12\n\nclass_name\x18\x01 \x01(\t\x12\x12\n\nconfidence\x18\x02 \x01(\x02\">\n\x11ModelListResponse\x12)\n\x06models\x18\x01 \x03(\x0b\x32\x19.imageclassificator.Model\"\x07\n\x05\x45mpty\"\\\n\x05Model\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x02 \x01(\t\x12\x0f\n\x07version\x18\x03 \x01(\t\x12\r\n\x05price\x18\x04 \x01(\x05\x12\x10\n\x08\x61\x63\x63uracy\x18\x05 \x01(\x02\x32\xc3\x01\n\x12ImageClassificator\x12]\n\x0c\x43lassifyFile\x12\x1f.imageclassificator.FileRequest\x1a*.imageclassificator.ClassificationResponse(\x01\x12N\n\nListModels\x12\x19.imageclassificator.Empty\x1a%.imageclassificator.ModelListResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'mlService_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_FILEREQUEST']._serialized_start=39
  _globals['_FILEREQUEST']._serialized_end=106
  _globals['_CLASSIFICATIONRESPONSE']._serialized_start=108
  _globals['_CLASSIFICATIONRESPONSE']._serialized_end=172
  _globals['_MODELLISTRESPONSE']._serialized_start=174
  _globals['_MODELLISTRESPONSE']._serialized_end=236
  _globals['_EMPTY']._serialized_start=238
  _globals['_EMPTY']._serialized_end=245
  _globals['_MODEL']._serialized_start=247
  _globals['_MODEL']._serialized_end=339
  _globals['_IMAGECLASSIFICATOR']._serialized_start=342
  _globals['_IMAGECLASSIFICATOR']._serialized_end=537
# @@protoc_insertion_point(module_scope)
