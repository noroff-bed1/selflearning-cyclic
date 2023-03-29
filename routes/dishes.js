var express = require('express');
var router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb')
const db = CyclicDB(process.env.CYCLIC_DB)
let dishes = db.collection('dishes')

router.get('/', async function(req, res, next) {
  let list = await dishes.list();
  res.send(list);
});

router.get('/:key', async function(req, res, next) {
  let item = await dishes.get(req.params.key);
  res.send(item);
});

router.post('/', async function(req, res, next) {
  const {name, country } = req.body;
  await dishes.set(name, {
    country: country
  })
  res.end();
});


module.exports = router;
