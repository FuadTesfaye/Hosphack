const database = require('../../../Database/Doctor/Profile Picture/Upload');
const multer = require('multer');
const uploadMiddleware = multer({ storage: multer.memoryStorage() }).single('file');

const upload = async (req, res) => {
    const doctorId = req.id;
    if (!doctorId) {
        return res.status(401).json();
    }
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(404).json({ message: 'No file uploaded' });
        }
        console.log('Uploaded file type:', req.file.mimetype);
        if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
            return res.status(400).json({ message: 'Invalid file type. Please upload an image file' });
        }
        try {
            const fileFlag = await database.updateFile(doctorId, req.file.buffer);
            if (!fileFlag) {
                return res.status(400).json({ message: 'File not inserted in the database' });
            }
            return res.status(201).json({ message: 'File uploaded successfully', file: fileFlag });
        } catch (error) {
            console.error('Error processing file:', error);
            return res.status(400).json({ message: 'Failed to insert file into the database' });
        }
    });
};

module.exports = { upload };