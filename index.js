var express = require('express');
var rp = require('request-promise');

var app = express();

app.get('/', function (req, res) {
  var address = req.param('address'); 
  res.send('Welcome to eth-fairy.');
});

app.get('/address/:addr', async (req, res, next) => {
    const addr = req.params.addr;
    console.log("/address/" + addr);

    const ret = await getBalance(addr); 
    res.send(ret);
})

function getBalance(address) {
  var options = {
    method: 'POST',
    uri: 'http://localhost:8545',
    body: {
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [
        address,
        "latest"
      ],
      id: 1
    },
    headers: {
       'Content-Type': 'application/json'
    },
    json: true
  };

  try {
    return rp(options)
      .then(function (body) {
        console.log(body)
        return body
      })
      .catch(function (err) {
       console.log(err)
      });
  } catch (e) {
    next(e)
  }
}

app.listen(3000, function () {
  console.log('Starting eth-fairy on port 3000!');
});
