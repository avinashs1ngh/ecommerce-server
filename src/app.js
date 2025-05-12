const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mainRouter = require('./routes/mainRouter'); 
const errorMiddleware = require('./middleware/errorMiddleware');
const { initializeDatabase } = require('./config/db');

const app = express();

initializeDatabase();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Testing ecommerce');
});

app.use('/api', mainRouter);

app.use(errorMiddleware);

module.exports = app;