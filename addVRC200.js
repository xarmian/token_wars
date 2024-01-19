// initialize sqlite database using argument name as DB file
// using database.js to create database tables
import { algodClient, indexerClient, db } from './config.js';
import * as database from './database.js';
import Contract from 'arc200js';

let assetId = Number(process.argv[2]);
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
