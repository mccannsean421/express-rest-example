const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 8080;

var corsOptions = {
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Set Static Directory
app.use(express.static('public'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/posts', cors(), (req, res) => {
  res.json([
    {
      title: 'post 1',
      description: 'Description of Post 1'
    }
  ])
})

app.listen(port, () => {
  console.log(`Example app running on port ${port}`);
});
