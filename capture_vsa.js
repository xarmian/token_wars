import { algodClient, indexerClient, db } from './config';
import * as database from './database.js';

const startRound = 35097494;

(async () => {
    console.log("Starting captureData...");
    //let round = await algodClient.status().do();
    //let currentRound = round["last-round"];
    let currentRound = startRound;

    while (true) {
        let block = await indexerClient.lookupBlock(currentRound).do();
        if (!block || !block['transactions']) {
            console.log("Waiting for transactions...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }
        
        for (let txn of block.transactions) {
            //if (txn["asset-transfer-transaction"] === undefined) continue;
            //if (txn["asset-transfer-transaction"]["asset-id"] === undefined) continue;

            if (assetIds.includes(txn["asset-id"])) {
                let transactionId = txn["id"];
                let tokenId = txn["asset-index"];
                let amount = txn["asset-amount"];
                let timestamp = block["timestamp"];
                let fromWallet = txn["sender"];
                let toWallet = txn["payment-transaction"]["receiver"];

                // use algodClient to get balances at block height for from and to wallets
                let fromWalletRec = await algodClient.accountInformation(fromWallet).do();
                let fromBalance = fromWalletRec["amount"];

                let toWalletRec = await algodClient.accountInformation(toWallet).do();
                let toBalance = toWalletRec["amount"];
                
                database.writeTransaction(db, { transaction_id: transactionId, token_id: tokenId, amount, timestamp, from_wallet: fromWallet, to_wallet: toWallet, from_balance: fromBalance, to_balance: toBalance, block: currentRound });
            }
        }
        currentRound++;
        break;
    }
})();