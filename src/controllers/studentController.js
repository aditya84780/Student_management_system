const Student = require('../models/student');
const csvGenerator = require('../utils/csvGenerator');

exports.createStudent = async (req, res) => {
  const student = new Student(req.body);
  try {
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.listStudents = async (req, res) => {
  const { page = 1, limit = 10, name = ""} = req.query;
  const query = {
    ...name ? { fullName: { $regex: name, $options: 'i' } } : {},
    isDeleted: false
  };
  try {
    const students = await Student.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
      const totalStudents = await Student.countDocuments(query);
      res.status(200).json({
        data: students,
        total: totalStudents,
        page,
        lastPage: Math.ceil(totalStudents / limit)
      });
  } catch (error) {
    res.status(500).send(error);
  }
  // try {
  //   const allstudents = await Student.find({});
  //   res.send(allstudents);
  // } catch (error) {
  //   res.status(400).send(error);
  // }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNumber: req.params.rollNumber },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNumber: req.params.rollNumber, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!student) {
      return res.status(404).send({ message: "No such student exists" });
    }
    res.send({ message: "Student deleted successfully.", student });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.downloadCSV = async (req, res) => {
    try{
        const students = await Student.find({});
        const csvContent = csvGenerator.generateCSV(students);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
        res.send(csvContent);
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).send('Failed to generate CSV');
    }
};
