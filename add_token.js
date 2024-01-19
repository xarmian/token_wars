// initialize sqlite database using argument name as DB file
// using database.js to create database tables
import { algodClient, indexerClient, db } from './config.js';
import * as database from './database.js';
import Contract from 'arc200js';

let tokenType;
const assetId = Number(process.argv[2]);

// figure out if assetId is a VRC200 or VSA
try {
    await algodClient.getAssetByID(assetId).do();
    tokenType = 'VSA';
}
catch(e) {
    tokenType = 'VRC200';
}

if (tokenType == 'VRC200') {
    let contract = new Contract(assetId, algodClient, indexerClient);

    let resp = await contract.getMetadata();
    if (resp.success) {
        let metadata = resp.returnValue;
        database.writeToken(db, { token_id: assetId, token_name: metadata.name, token_symbol: metadata.symbol, token_decimals: metadata.decimals, token_supply: metadata.totalSupply, token_type: "VRC200" });
    }
    else {
        console.log("Error getting metadata");
        console.log(resp);
    }
    console.log("Added VRC200: " + assetId);
}
else if (tokenType == 'VSA') {
    let assetInfo = await algodClient.getAssetByID(assetId).do();
    database.writeToken(db, { token_id: assetId, token_name: assetInfo["params"]["name"], token_symbol: assetInfo["params"]["unit-name"], token_decimals: assetInfo["params"]["decimals"], token_supply: assetInfo["params"]["total"], token_type: "VSA" });
    console.log("Added VSA: " + assetId);
}