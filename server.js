const express = require('express');
const app = express();
const controllers = require('./controllers');
require('dotenv').config()
const { PORT } = process.env;
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/reps', controllers.civicInfo);

app.get('/', (req, res) => {
    res.send('Hello, world. This is working.')
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));