var express = require('express');
var router = express.Router();
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/json', async function(req, res, next) {
  let my_file
  try {
      my_file = await s3.getObject({
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: "my_file.json",
    }).promise()
  }
  catch {
    res.send({
      message: "file does not exist"
    });  
    return;
  }
  const result = JSON.parse(my_file.Body)?.content
  if(result == null) {
    res.send({
      message: "value is not in the database"
    });  
  }
  else {
    res.send(result);  
  }
});

router.post('/json', async function(req, res, next) {
  const {content} = req.body;
  const contentObj = {
    content: content
  }
  await s3.putObject({
    Body: JSON.stringify(contentObj),
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Key: "my_file.json",
  }).promise()
  res.end();
});

module.exports = router;
