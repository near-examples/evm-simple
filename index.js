const Contract = require('web3-eth-contract');
const { NearProvider, utils, nearAPI } = require('near-web3-provider');

Demo = {
  start: async function() {
    await this.callEvm('mike.betanet');
    console.log('-------------------')
    await this.callEvm('josh.betanet');
  },

  callEvm: async function(betanetAccount) {
    console.log(`Interacting with ${betanetAccount}`);
    const nearProvider = new NearProvider({
      networkId: 'betanet',
      masterAccountId: betanetAccount,
      // See list of near-api-js keystores here: https://near.github.io/near-api-js/classes/_key_stores_keystore_.keystore.html
      keyStore: new nearAPI.keyStores.UnencryptedFileSystemKeyStore('./private-keys'),
    });
    // See the NEAR Pet Shop example at: https://github.com/near-examples/near-pet-shop
    const myContractArtifact = require('./build/contracts/Adoption.json');
    const networkId = nearProvider.version;
    console.log('aloha networkId', networkId);
    const myContractAddress = myContractArtifact.networks[networkId].address;
    const myContract = new Contract(myContractArtifact.abi, myContractAddress, {
      from: myContractAddress
    });
    myContract.setProvider(nearProvider);
    // signed
    const betanetAccountAsEthAddress = utils.nearAccountToEvmAddress(betanetAccount); // could also get the account with web3.eth.getAccounts
    console.log(`The NEAR account ${betanetAccount} is ${betanetAccountAsEthAddress} on the EVM`);
    console.log('Setting first item to the EVM account…')
    // We're setting the first entry in the array to be the accounts EVM address
    const signedResult = await myContract.methods.adopt(0).send({from: betanetAccountAsEthAddress});
    let transactionHash = signedResult.transactionHash.split(':')[0];
    console.log(`View transaction in NEAR Explorer: https://explorer.betanet.near.org/transactions/${transactionHash}`);
    // view-only
    console.log('Retrieving state…')
    const viewResult = await myContract.methods.getAdopters().call();
    console.log('viewResult', viewResult);
  }
}

Demo.start();