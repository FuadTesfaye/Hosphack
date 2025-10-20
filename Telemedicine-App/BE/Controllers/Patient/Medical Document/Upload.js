const database = require('../../../Database/Patient/Medical Document/Upload');
const multer = require('multer');
const uploadMiddleware = multer({ storage: multer.memoryStorage() }).array('files');

const upload = async (req, res) => {
    const patientId = req.id;
    if (!patientId) {
        return res.status(401).json();
    }
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(404).json({ message: 'No files uploaded' });
        }
        const uploadedFiles = req.files;
        const insertedFiles = [];
        try {
            for (const file of uploadedFiles) {
                const fileFlag = await database.insertFile(patientId, file.originalname, file.mimetype, file.buffer);
                if (fileFlag) {
                    insertedFiles.push(fileFlag);
                }
            }
            if (!insertedFiles.length) {
                return res.status(400).json({ message: 'No files are inserted in the database' });
            }
            return res.status(200).json({ message: `Successfully uploaded ${insertedFiles.length} files from ${uploadedFiles.length}`, files: insertedFiles });
        } catch (error) {
            console.error('Error processing files:', error);
            return res.status(400).json({ message: 'Failed to insert files into the database' });
        }
    });
};


module.exports = { upload };