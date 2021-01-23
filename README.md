# Simple interaction with NEAR EVM

There are two examples in this repository. The first is the NodeJS script `index.js` at the root of this repository, which will be run on the command line. The second is a simple web interface app located at `frontend/index.html`. The first will use smart contract abstraction, while the second will interact more directly with the NEAR EVM on betanet — a network in the release cycle before testnet and mainnet.

This repository serves to demonstrate basic interactions with the NEAR EVM using NodeJS, a deployed [NEAR Pet Shop](https://github.com/near-examples/near-pet-shop) contract, and two NEAR betanet accounts.
    
## Project structure

```shell script
.
├── build
│  └── contracts
│     └── Adoption.json     ⟵ artifact from NEAR Pet Shop
├── index.js                ⟵ main file with EVM interaction
├── frontend
│  └── index.html           ⟵ basic frontend calling EVM directly 
├── package.json            ⟵ list dependencies for interaction
├── neardev                 ⟵ contains private (function-call access ) keys
│  └── betanet
│     ├── josh.betanet.json ⟵ function-call access key
│     └── mike.betanet.json ⟵ function-call access key
└── README.md               ⟵ you are here
```

## 1. NodeJS Script

    npm install
    node index.js

### Adoption artifact

The file `./build/contracts/Adoption.json` is an artifact build when compiling the NEAR Pet Shop example linked earlier. This contains information about the application binary interface (ABI) and details of the deployment. The main file, `index.js` will load this file and be able to determine a few things including the [registered chain ID](https://chainid.network), EVM address where the contract is deployed, function signatures, etc.

Note that this artifact file is only used in the NodeJS script, not in the frontend example.

### `index.js`

This file will use `view` (non-mutable) and `call` (mutating) function calls on the contract. In this simple demonstration, it will use private keys for the accounts `mike.betanet` and `josh.betanet` to interact directly with the smart contract on the NEAR EVM account.

The NEAR Pet Shop smart contract is deployed to **betanet**'s EVM, which lives at the account `evm`. This `evm` account can and will have many smart contracts deployed to it, with its transactions operating synchronously.

Please see the comments in this file for more information.

### Private keys

Two private keys exist in this project. They are special keys called "function-call access keys" that allow for limited interaction with an account. In this case, both keys have been given an allowance of NEAR tokens (Ⓝ) to spend in gas for transactions that interact with the `evm`. These keys cannot call any other native smart contract on NEAR. They cannot transfer Ⓝ, delete the account, etc. In contrast, NEAR has full access keys which can perform all those [native Actions](https://nomicon.io/RuntimeSpec/Actions.html) and more.

For more information on access keys, please [see the documentation](https://docs.near.org/docs/concepts/account#access-keys).

### Notes

This NodeJS script uses the contract ABI as well as the [`web3-eth-contract` dependency](https://www.npmjs.com/package/web3-eth-contract). In combination, these allow for nice abstraction while interacting with the smart contract. For instance, when viewing state we can use:

```javascript
let result = await myContract.methods.getAdopters().call();
```

The `result` from above is — as you can see from running the script — a nicely-formatted array of Ethereum addresses. The NEAR EVM actually returns a representation that is less pretty, but with the ABI we have all the info needed about the structure and type(s) of the data returned. In the frontend example, we'll demonstrate using NEAR Web3 Provider in a more raw manner to illustrate what's happening under the abstraction.

## 2. Frontend example

The `frontend/index.html` file loads the `near-web3-provider` from a CDN and interacts with plain JavaScript. It contains the private keys for `mike.betanet` and `josh.betanet` in plain text.

### Usage

Just double-click the HTML file to load it in your browser. There are three buttons for smart contract interactions:

1. Refresh — this instantiates `NearProvider` as read-only and fetches the state from a contract that lives on the NEAR's betanet EVM.
2. Send transaction from Mike — sends a transaction signed by `mike.betanet` calling the method `adopt(uint256)`.
3. Send transaction from Josh — sends a similar transaction to #2, but from `josh.betanet`.

When you click one of the buttons to send a transaction, note that a link to the NEAR Betanet Explorer will appear. This is similar to etherscan.io for Ethereum, and will show details about the transaction. At the time of this writing, the data section in Explorer isn't optimized to show EVM details.

At the bottom of the page there's an input and button to translate a NEAR account name into an EVM address.

### Notes

The frontend example uses the NEAR provider to call two methods in the library:

1. `routeEthCall` — this corresponds to the [Ethereum API `eth_call`](https://eth.wiki/json-rpc/API#eth_call).
2. `routeEthSendTransaction` — this corresponds to the Ethereum API [`eth_sendTransaction`](https://eth.wiki/json-rpc/API#eth_sendtransaction).

This example isn't a typical way of writing a decentralized app, but offers clues into the abstraction layer and inner workings.

---

## What's next?

The next logical example is to check out the [NEAR Pet Shop](https://github.com/near-examples/near-pet-shop) example. After that, it's advisable to review the [Proxy RPC Server documentation](https://docs.near.org/docs/evm/near-eth-rpc) as it might be an alternate solution to using the NEAR Provider demonstrated here. 
