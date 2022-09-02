const express = require('express');
const app = express();
const jwtRouter = require('./Routes/routes');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/auth', jwtRouter);

module.exports = app;
