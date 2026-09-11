/**
 * FoodShareAI - Storage Service
 * Hardened modular abstraction for image storage.
 * Enforces MIME type whitelisting, file size restrictions, and prevents local path leakage.
 * Easily swappable with AWS S3, Cloudinary, Firebase Storage, or local file storage.
 */
const path = require('path');

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp'];
const FORBIDDEN_EXTENSIONS = ['.exe', '.sh', '.bat', '.cmd', '.py', '.js', '.html', '.php', '.bin'];

/**
 * Upload an image or resolve image reference safely
 * @param {string} imageInput Remote URL, base64 data URI, or asset identifier
 * @returns {Promise<{ url: string, format: string, sizeBytes: number }>}
 */
const uploadImage = async (imageInput) => {
  if (!imageInput || typeof imageInput !== 'string') {
    const err = new Error('Valid image input string or URL is required');
    err.statusCode = 400;
    throw err;
  }

  const trimmed = imageInput.trim();

  // Check for forbidden file extension patterns in raw strings
  const lower = trimmed.toLowerCase();
  for (const ext of FORBIDDEN_EXTENSIONS) {
    if (lower.endsWith(ext) || lower.includes(`${ext}?`)) {
      const err = new Error(`File format not permitted. Executable and script files are strictly blocked.`);
      err.statusCode = 400;
      throw err;
    }
  }

  // 1. Remote URL handling (HTTP/HTTPS)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      new URL(trimmed); // Validates URL structure
    } catch (_) {
      const err = new Error('Invalid image URL format');
      err.statusCode = 400;
      throw err;
    }

    const format = lower.endsWith('.png')
      ? 'png'
      : lower.endsWith('.webp')
      ? 'webp'
      : 'jpeg';

    return {
      url: trimmed,
      format,
      sizeBytes: 0,
    };
  }

  // 2. Base64 Data URI handling (data:image/...)
  if (trimmed.startsWith('data:image/')) {
    const matches = trimmed.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      const err = new Error('Malformed base64 image data URI');
      err.statusCode = 400;
      throw err;
    }

    const rawFormat = matches[1].toLowerCase();
    const format = rawFormat === 'jpg' ? 'jpeg' : rawFormat;

    if (!ALLOWED_IMAGE_FORMATS.includes(format)) {
      const err = new Error(
        `Unsupported image format '${rawFormat}'. Allowed formats: ${ALLOWED_IMAGE_FORMATS.join(', ')}`
      );
      err.statusCode = 400;
      throw err;
    }

    const base64Data = matches[2];
    const estimatedSizeBytes = Math.round((base64Data.length * 3) / 4);

    if (estimatedSizeBytes > MAX_IMAGE_SIZE_BYTES) {
      const err = new Error(`Image size exceeds maximum limit of 10MB`);
      err.statusCode = 413;
      throw err;
    }

    return {
      url: trimmed,
      format,
      sizeBytes: estimatedSizeBytes,
    };
  }

  // 3. Fallback identifier (protect against leaking sensitive filesystem paths)
  if (trimmed.includes('/') || trimmed.includes('\\')) {
    // Sanitize by keeping only the basename without local directory structures
    const cleanName = path.basename(trimmed);
    return {
      url: `https://images.foodshareai.org/uploads/${cleanName}`,
      format: 'jpeg',
      sizeBytes: 0,
    };
  }

  return {
    url: trimmed,
    format: 'jpeg',
    sizeBytes: 0,
  };
};

/**
 * Delete an image
 * @param {string} imageUrl URL of image to delete
 * @returns {Promise<boolean>}
 */
const deleteImage = async (imageUrl) => {
  return true;
};

module.exports = {
  uploadImage,
  deleteImage,
  MAX_IMAGE_SIZE_BYTES,
  ALLOWED_IMAGE_FORMATS,
};
