const mongoose = require('mongoose');

const rollNumberSchema = new mongoose.Schema({
  courseYearCode: { type: String, unique: true, required: true }, // Combination of year and course code
  lastNumber: { type: Number, default: 0 } // Last four digits used
});
 
module.exports = mongoose.model('RollNumber', rollNumberSchema);
