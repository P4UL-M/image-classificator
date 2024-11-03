const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB size limit

/**
 * Middleware to validate file type and size.
 * 
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
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
    let error = false;

    req.on('data', (chunk) => {
        totalSize += chunk.length;

        // Reject if file size exceeds the limit
        if (totalSize > MAX_FILE_SIZE && !res.headersSent && !req.destroyed && !error) {
            error = true;
            req.pause();
            res.status(413).send('Payload Too Large');
        }
    });

    // Start processing the next middleware immediately
    next();
}

exports.validateFileTypeAndSize = validateFileTypeAndSize;