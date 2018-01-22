const express = require('express');
const rp = require('request-promise');
const os = require("os");
var NumberConverter = require("number-converter").NumberConverter;

if(os.type() != "Linux") {
  console.log("eth-fairy is currently only available for linux");
  process.exit(1);
}

const rpcCalls = {
  getBalance: "eth_getBalance"
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

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

    var ret = await getBalanceRPC(addr); 
    if(ret != null) {
      ret = formatResultRPC(rpcCalls.getBalance, ret);
      res.send(ret);
    } else {
      res.send({});
    }
})

function formatResultRPC(method, json) {
  switch(method) {
    case rpcCalls.getBalance:
      if(json.hasOwnProperty("result")) {
        var nc = new NumberConverter(NumberConverter.HEXADECIMAL, NumberConverter.DECIMAL);
        var balanceHex = json.result; 
        if(balanceHex.startsWith('0x')) {
          balanceHex = balanceHex.substr(2);
          console.log('Trimming 0x from hex: ' + balanceHex);
        }
        var balanceWei = nc.convert(balanceHex.toUpperCase());
        console.log('Converted ' + balanceHex + ' to ' + balanceWei);
        var result = {};
        result.balance = balanceWei / 1e18;
        result.balanceWei = balanceWei;  
        result.balanceHex = balanceHex;
        return result;
      } else {
        console.log('Error: Unexpected RPC return.  ' + json);
        return null;
      }
    default:
      return null;
  }
}

function getBalanceRPC(address) {
  var options = {
    method: 'POST',
    uri: 'http://localhost:8545',
    body: {
      jsonrpc: "2.0",
      method: rpcCalls.getBalance,
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

  return rp(options)
    .then(function (body) {
      console.log(body);
      return body;
    })
    .catch(function (err) {
      console.log(err);
    });
}

app.listen(3000, function () {
  console.log('Starting eth-fairy on port 3000!');
});
