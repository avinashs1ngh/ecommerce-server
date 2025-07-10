const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mainRouter = require('./routes/mainRouter');
const errorMiddleware = require('./middleware/errorMiddleware');
const { initializeDatabase } = require('./config/db');
const path = require('path');
const app = express();

initializeDatabase();

// app.use(helmet());
app.use(cors({
 origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

console.log(path.join(__dirname, '..', 'uploads')); 
app.get('/', (req, res) => {
  res.send('Testing ecommerce');
});


// Serve static files from the "uploads" directory
app.use('/uploads',cors({
  origin: '*'
}), express.static(path.join(__dirname, 'uploads'))); 


app.use('/api', mainRouter);

app.use(errorMiddleware);

module.exports = app;
