const database = require('../../../Database/Patient/Medical Document/Delete');

const deleteFile = async (req, res) => {
    const patientId = req.id;
    const FilesToBeDeletedIds = req.body.filesIds;
    const deletedFilesIds = [];
    if (!patientId) {
        return res.status(401).json();
    }
    if (!FilesToBeDeletedIds || FilesToBeDeletedIds.length === 0) {
        return res.status(404).json({ message: 'No files to delete' });
    }
    try {
        for (const fileId of FilesToBeDeletedIds) {
            const file = await database.deleteFile(patientId, fileId);
            if (file) {
                console.log(`File of id ${file} deleted successfully`);
                deletedFilesIds.push(file);
            }
        }
        return res.status(200).json({ message: `Deleted ${deletedFilesIds.length} files from ${FilesToBeDeletedIds.length}`, deletedFilesIds: deletedFilesIds });
    } catch (error) {
        console.error('Error deleting files:', error);
        return res.status(400).json({ message: 'Failed to delete files' });
    }
};


module.exports = { deleteFile };