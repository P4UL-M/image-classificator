const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB size limit

/**
 * Middleware to validate file type and size.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * 
 * @returns {void}
 * 
 * @throws {Error} 415 - Unsupported file type.
 * @throws {Error} 413 - File size exceeds limit.
 */
function validateFileTypeAndSize(req, res, next) {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    // Check if the request is an accepted mime type
    if (!allowedMimeTypes.includes(req.headers['content-type'])) {
        return res.status(415).send('Unsupported file type.');
    }

    // We expect 'file' to be a part of the form-data
    let totalSize = 0;

    req.on('data', (chunk) => {
        totalSize += chunk.length;

        // Reject if file size exceeds the limit
        if (totalSize > MAX_FILE_SIZE) {
            return res.status(413).send('File size exceeds limit.');
        }
    });

    req.on('end', () => {
        // Ensure total size is under the limit
        if (totalSize > MAX_FILE_SIZE) {
            return res.status(413).send('File size exceeds limit.');
        }
    });

    next();
}

exports.validateFileTypeAndSize = validateFileTypeAndSize;