import struct
import os
from typing import Dict, Any

JSF_MAGIC_NUMBER = 0x1601

class JsfParser:
    """
    Parser for EdgeTech JSF raw sonar stream files.
    """

    @classmethod
    def probe_and_parse(cls, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"JSF file does not exist: {file_path}")

        file_size = os.path.getsize(file_path)
        if file_size < 16:
            return {"is_valid_jsf": False, "format_supported": False, "error": "File too small"}

        try:
            with open(file_path, "rb") as f:
                header = f.read(16)
                if len(header) < 16:
                    return {"is_valid_jsf": False, "format_supported": False, "error": "Header truncated"}

                # JSF message header:
                # uint16 marker (0x1601)
                # uint8 protocol version
                # uint8 session ID
                # uint16 message type (2020 = sonar data, 2000 = system info)
                # uint8 command type
                # uint8 subsystem
                # uint8 channel
                # uint8 sequence number
                # uint32 size of message
                marker = struct.unpack("<H", header[:2])[0]
                if marker != JSF_MAGIC_NUMBER:
                    return {
                        "is_valid_jsf": False,
                        "format_supported": False,
                        "error": f"Invalid JSF marker 0x{marker:04X} (expected 0x1601)"
                    }

                msg_type = struct.unpack("<H", header[4:6])[0]
                channel = header[8]

                return {
                    "is_valid_jsf": True,
                    "format_supported": True,
                    "marker": hex(marker),
                    "initial_message_type": msg_type,
                    "channel": channel,
                    "file_size_bytes": file_size,
                    "system_description": "EdgeTech 4200/4125 Acoustic Logging Stream"
                }
        except Exception as e:
            return {
                "is_valid_jsf": False,
                "format_supported": False,
                "error": str(e)
            }
