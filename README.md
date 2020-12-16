# Simple interaction with NEAR EVM

This repository serves to demonstrate basic interactions with the NEAR EVM using NodeJS, a deployed [NEAR Pet Shop](https://github.com/near-examples/near-pet-shop) contract, and two NEAR betanet accounts.

## Using

    npm install
    node .
    
## Project structure

```shell script
.
├── build
│  └── contracts
│     └── Adoption.json     ⟵ artifact from NEAR Pet Shop
├── index.js                ⟵ main file with EVM interaction
├── package.json            ⟵ list dependencies for interaction
├── private-keys
│  └── betanet
│     ├── josh.betanet.json ⟵ function-call access key
│     └── mike.betanet.json ⟵ function-call access key
└── README.md               ⟵ you are here
```

## Adoption artifact

The file `./build/contracts/Adoption.json` is an artifact build when compiling the NEAR Pet Shop example linked earlier. This contains information about the application binary interface (ABI) and details of the deployment. The main file, `index.js` will load this file and be able to determine a few things including the [registered chain ID](https://chainid.network), EVM address where the contract is deployed, function signatures, etc.

## `index.js`

This file will use `view` (non-mutable) and `call` (mutating) function calls on the contract. In this simple demonstration, it will use private keys for the accounts `mike.betanet` and `josh.betanet` to interact directly with the smart contract on the NEAR EVM account.

The NEAR Pet Shop smart contract is deployed to **betanet**'s evm, which lives at the account `evm`. This `evm` account can and will have many smart contracts deployed to it, with its transactions operating synchronously.

Please see the comments in this file for more information.

## Private keys

Two private keys exist in this project. They are special keys called "function-call access keys" that allow for limited interaction with an account. In this case, both keys have been given an allowance of NEAR tokens (Ⓝ) to spend in gas for transactions that interact with the `evm`. These keys cannot call any other native smart contract on NEAR. They cannot transfer Ⓝ, delete the account, etc. In contrast, NEAR has full access keys which can perform all those [native Actions](https://nomicon.io/RuntimeSpec/Actions.html) and more.

For more information on access keys, please [see the documentation](https://docs.near.org/docs/concepts/account#access-keys).