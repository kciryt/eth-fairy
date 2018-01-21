# Eth Fairy 

Eth Fairy wraps geth's rpcapi with an express service.<br/>
This means that geth also should be running for this to work.

```bash
geth --rpc --rpcapi eth,web3,personal,admin,debug --syncmode fast --rpcport 8545 --port 30309
```

## Purpose

Above

## To Do

A list of additions and improvements:

* [ ] Add config and refactor hardcoded values 
* [ ] Add more endpoints 
* [ ] Add tls/ssl support 
* [ ] Add support for other OS? Nah...
