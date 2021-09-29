const validateHmac = (process.env.NODE_ENV === 'production');
const confOptions = {
    hmacValidation: validateHmac
}
const conf = require('@tsmx/secure-config')(confOptions);

var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.json(conf);
});

app.listen(3000, function () {
  console.log('secure-config-test app listening on port 3000...');
});