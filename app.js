const conf = require('@tsmx/secure-config');
var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.json(conf);
});

app.listen(3000, function () {
  console.log('secure-config-test app listening on port 3000...');
});