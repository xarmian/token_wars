// initialize sqlite database using argument name as DB file
// using database.js to create database tables
import * as database from './database.js';
import { algodClient, indexerClient, db } from './config.js';
import Contract from 'arc200js';
import { vrc200Tokens as tokens } from './tokens.js';

await database.createTables(db);

// add VRC200 tokens
for (let token of tokens) {
    let contract = new Contract(token, algodClient, indexerClient);
    let resp = await contract.getMetadata();
    if (resp.success) {
        let metadata = resp.returnValue;
        database.writeToken(db, { token_id: token, token_name: metadata.name, token_symbol: metadata.symbol, token_decimals: metadata.decimals, token_supply: metadata.totalSupply, token_type: "VRC200" });
    }
    else {
        console.log("Error getting metadata for token: " + token);
        console.log(resp);
    }
}

database.writeLiquidityPool(db, { pool_app_id: 26167314, pool_app_account: "U3VFCRU3WU2CCIZP6Z4ALK3ZGHGPLTJ73Q3GSZK7QXBJUAANK7ORSHDVAA", pool_token_id: 6795477, pool_lptoken_id: 26167319, pool_type: "VRC200", pool_mgr: "NOMADEX" });