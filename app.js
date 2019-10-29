/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const store = require('./store.js');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
  let filtered = [...store];

  const validSortTypes = ['Rating', 'App'];
  const validGenres = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];

  const sort = req.query.sort.charAt(0).toUpperCase() + req.query.sort.slice(1);

  if (req.query.sort && (!validSortTypes.includes(sort))) {
    return res.status(400).send('Sort must be either rating or app');
  }
  

  if(sort) {
    filtered = filtered.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
  }

  res.json(filtered);
});

app.listen(8000, () => {
  console.log('listening!');
});