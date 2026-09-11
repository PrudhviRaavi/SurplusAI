import base64
import io
import re
from typing import Tuple, Optional
from PIL import Image, UnidentifiedImageError
import numpy as np

def decode_image_bytes(image_data: bytes) -> Tuple[Image.Image, dict]:
    """
    Decodes raw image bytes into a PIL RGB Image and returns image metadata.
    Raises ValueError if data is corrupted or unsupported format.
    """
    try:
        image_stream = io.BytesIO(image_data)
        pil_image = Image.open(image_stream)
        pil_image.verify()  # Verify image integrity
        
        # Re-open because verify() mutates the stream pointer
        image_stream.seek(0)
        pil_image = Image.open(image_stream)
        
        fmt = pil_image.format or "UNKNOWN"
        width, height = pil_image.size
        size_bytes = len(image_data)
        
        # Ensure conversion to standard RGB (handles RGBA, Palette, Grayscale)
        rgb_image = pil_image.convert("RGB")
        
        metadata = {
            "format": fmt.upper(),
            "dimensions": {"width": width, "height": height},
            "sizeBytes": size_bytes,
        }
        return rgb_image, metadata
    except (UnidentifiedImageError, OSError, SyntaxError) as e:
        raise ValueError(f"Invalid or corrupted image payload: {str(e)}")

def decode_base64_or_data_uri(payload: str) -> Tuple[Image.Image, dict]:
    """
    Decodes a base64 string or data URI (e.g., data:image/jpeg;base64,...)
    """
    cleaned = payload.strip()
    if cleaned.startswith("data:"):
        match = re.match(r"^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$", cleaned, re.DOTALL)
        if match:
            cleaned = match.group(1)
        else:
            raise ValueError("Invalid data URI structure for image")
            
    try:
        raw_bytes = base64.b64decode(cleaned)
    except Exception as e:
        raise ValueError(f"Failed to decode base64 image data: {str(e)}")
        
    return decode_image_bytes(raw_bytes)

def pil_to_numpy_rgb(pil_image: Image.Image) -> np.ndarray:
    """Converts a PIL RGB image to a NumPy RGB array (H, W, 3)."""
    return np.array(pil_image)
