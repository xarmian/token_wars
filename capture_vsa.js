import { algodClient, indexerClient, db } from './config';
import * as database from './database.js';

(async () => {
    // get list of tokens from tokens table
    let assetIds = database.getTokens(db,'VSA').map(token => token.token_id);

    for (let assetId of assetIds) {
        const startRound = database.getStartRound(db, assetId);
        console.log(`Starting captureData for asset ${assetId} at round ${startRound}...`);

        let response = await indexerClient.searchForTransactions()
                                          .assetID(asaId)
                                          .minRound(startRound)
                                          .do();

        for (let tx of response.transactions) {
            let fromWallet = await algodClient.accountInformation(tx.sender).do();
            let fromBalance = fromWallet["amount"];

            let toWallet = await algodClient.accountInformation(tx.receiver).do();
            let toBalance = toWallet["amount"];

            database.writeTransaction(db, { transaction_id: tx.id, token_id: assetId, amount: tx.amount, from_wallet: tx.sender, to_wallet: tx.receiver, from_balance: fromBalance, to_balance: toBalance, block: tx.confirmedRound, timestamp: tx.timestamp });

        }
    }
})();