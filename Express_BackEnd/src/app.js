const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const envVars = process.env;
const myErrorLogger = require('./utilities/ErrorLogger');
const myRequestLogger = require('./utilities/RequestLogger');
const userRouter = require('./routes/userRouter');
const bookingRouter = require('./routes/bookingRouter');
const packageRouuter = require('./routes/packageRouter');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(myRequestLogger);
app.use('/healthCheck', (req, res, next) => {
    res.send('I am alive!')
})
app.use('/user', userRouter);
app.use('/booking', bookingRouter);
app.use('/package', packageRouuter);
app.use(myErrorLogger);

app.listen(envVars.PORT);
console.log("Server listening in port 4000 ");

module.exports = app;