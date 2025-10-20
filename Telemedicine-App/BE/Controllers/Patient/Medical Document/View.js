const database = require('../../../Database/Patient/Medical Document/View');

const view = async (req, res) => {
    const patientId = req.id;
    if (!patientId) {
        return res.status(401).json();
    }
    try {
        const files = await database.retrieveFiles(patientId);
        if (!files) {
            return res.status(404).json({ message: 'No files found' });
        }
        return res.status(200).json({ message: 'Files retrieved successfully', files: files });
    } catch (error) {
        console.error('Error retrieving files:', error);
        return res.status(400).json({ message: 'Failed to retrieve files' });
    }
};


module.exports = { view };