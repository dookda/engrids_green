const express = require('express')
const app = express()

app.use('/green', require('./service/api'));
app.use('/green', express.static('www'));

const port = 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});