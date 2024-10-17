from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class FileRequest(_message.Message):
    __slots__ = ("file_content",)
    FILE_CONTENT_FIELD_NUMBER: _ClassVar[int]
    file_content: bytes
    def __init__(self, file_content: _Optional[bytes] = ...) -> None: ...

class ClassificationResponse(_message.Message):
    __slots__ = ("class_name", "confidence")
    CLASS_NAME_FIELD_NUMBER: _ClassVar[int]
    CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    class_name: str
    confidence: float
    def __init__(self, class_name: _Optional[str] = ..., confidence: _Optional[float] = ...) -> None: ...
