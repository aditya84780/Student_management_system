require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const studentRoutes = require('./api/routes');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error', err));

app.use(bodyParser.json());
app.use('/students', studentRoutes);
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
