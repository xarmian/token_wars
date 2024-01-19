// initialize sqlite database using argument name as DB file
// using database.js to create database tables
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

let assetId = Number(process.argv[3]);
let contract = new Contract(assetId, algodClient, indexerClient);

let resp = await contract.getMetadata();
if (resp.success) {
    let metadata = resp.returnValue;
    database.writeToken(db, { tokenId: assetId, tokenName: metadata.name, tokenSymbol: metadata.symbol, tokenDecimals: metadata.decimals, tokenSupply: metadata.totalSupply, tokenType: "VRC200" });
}
else {
    console.log("Error getting metadata");
    console.log(resp);
}
