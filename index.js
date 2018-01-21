const express = require('express');
const rp = require('request-promise');
const os = require("os");

if(os.type() != "Linux") {
  console.log("eth-fairy is currently only available for linux");
  process.exit(1);
}

var app = express();

app.get('/', function (req, res) {
  var response = '<html><title>Eth Fairy</title><body>Welcome to eth-fairy<br/><br/>';
  response += 'APIs<br/>';
  response += '/address/:addr<br/>';
  response += '</body></html>';
  res.send(response);
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
