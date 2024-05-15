const mongoose = require('mongoose');
const RollNumber = require('./rollNumber');

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: Number,
});

const EnrolledCourseSchema = new mongoose.Schema({
    enrolledOn: Date,
    courseCode: String,
    courseName: String,
});

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: false, unique: true },
  fullName: String,
  enrolledCourse: EnrolledCourseSchema,
  email: String,
  address: AddressSchema,
  dateOfBirth: Date,
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

StudentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const year = this.enrolledCourse.enrolledOn.getFullYear().toString().slice(-2);
    const courseCode = this.enrolledCourse.courseCode;
    const collegeCode = 'TF'; // Assuming the college code is always 'TF'
    // const uniqueCode = Math.floor(Math.random() * 9999); // initial solution with random unique code generation
    const courseYearCode = `${collegeCode}${year}${courseCode}`;

    try {
      // Find the roll number portion for the given course and year, or create a new one
      const rollNumberDoc = await RollNumber.findOneAndUpdate(
        { courseYearCode },
        { $inc: { lastNumber: 1 } }, // Increment the last number atomically
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      const uniqueCode = rollNumberDoc.lastNumber.toString().padStart(4, '0');
      this.rollNumber = `${courseYearCode}${uniqueCode}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Student', StudentSchema);
