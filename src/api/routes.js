const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

router.post('/', StudentController.createStudent);
router.get('/', StudentController.listStudents);
router.put('/:rollNumber', StudentController.updateStudent);
router.delete('/:rollNumber', StudentController.deleteStudent);
router.get('/download_csv', StudentController.downloadCSV);

module.exports = router;
