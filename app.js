const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

//Models
const Post = require("./models/post");

const app = express();
const port = 8080;

// DB Connection

mongoose.connect('mongodb://mccann:password1@ds061928.mlab.com:61928/venm-example');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

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

// Create Post
app.post('/posts', (req, res) => {
  let db = req.db;
  let title = req.body.title;
  let description = req.body.description;

  console.log(req.body);

  let newPost = new Post({
    title: title,
    description: description,
  });

  newPost.save((error) => {
    if (error) {
      console.log(error);
    }

    res.send({
      success: true,
      message: 'Post saved!'
    })
  })

})


// Get Posts
app.get('/posts', cors(), (req, res) => {
  Post.find({}, 'title description', (error, posts) => {
    if (error) {
      console.error(error);
    }

    res.send({
      posts: posts
    })
  }).sort({_id:-1});
});

// Get a Single Post
app.get('/posts/:id', (req, res) => {
  let db = req.db;

  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) console.error(error);
    res.send(post);
  })
})

// Get a Single Post
app.put('/posts/:id', (req, res) => {
  let db = req.db;

  Post.findById(req.params.id, 'title description', (error, post) => {
    if (error) console.error(error);

    post.title = req.body.title;
    post.description  = req.body.description;
    post.save((error) => {
      if (error) console.error(error);

      res.send({
        success: true
      });
    })
  })
});

// Delete Post
app.delete('/posts/:id', (req, res) => {
  let db = req.db;

  Post.remove({
    _id: req.params.id
  }, (err, post) => {
    if (err) res.send(err);

    res.send({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app running on port ${port}`);
});
