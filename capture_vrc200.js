import algosdk from 'algosdk';
import * as database from './database.js';
import Contract from 'arc200js';

let filename = process.argv[2];

if (typeof filename == 'undefined') {
    console.log('Please provide a filename');
    process.exit(1);
}

const db = database.initDB(filename);
const algodClient = new algosdk.Algodv2("", "https://testnet-api.voi.nodly.io", 443);
const indexerClient = new algosdk.Indexer("", "https://testnet-idx.voi.nodly.io", 443);

(async () => {
    // get list of tokens from tokens table
    let assetIds = database.getTokens(db,'VRC200').map(token => token.token_id);

    for (let assetId of assetIds) {
        const startRound = database.getStartRound(db, assetId);
        console.log(`Starting captureData for asset ${assetId} at round ${startRound}...`);

        let contract = new Contract(assetId, algodClient, indexerClient);
        let transactions = await contract.arc200_Transfer({
            minRound: startRound,
        });

        for (let tx of transactions) {
            let transactionId = tx[0];
            let block = tx[1];
            let amount = tx[5];
            let timestamp = tx[2];
            let fromWalletId = tx[3];
            let toWalletId = tx[4];

            // use algodClient to get balances at block height for from and to wallets
            let fromWallet = await algodClient.accountInformation(fromWalletId).do();
            let fromBalance = fromWallet["amount"];

            let toWallet = await algodClient.accountInformation(toWalletId).do();
            let toBalance = toWallet["amount"];

            database.writeTransaction(db, { transactionId, tokenId: assetId, amount, fromWallet: fromWalletId, toWallet: toWalletId, fromBalance: fromBalance, toBalance: toBalance, block, timestamp });

        }
    }

})();
