// initialize sqlite database using argument name as DB file
// using database.js to create database tables
import * as database from './database.js';

let filename = process.argv[2];

if (typeof filename == 'undefined') {
    filename = 'tokenWars.db';
}

const db = database.initDB(filename);
database.createTables(db);

database.writeToken(db, { tokenId: 6795477, tokenName: "Taco", tokenSymbol: "TACO", tokenDecimals: 0, tokenSupply: 10_000_000_000, tokenType: "VRC200" });
// database.writeToken(db, { tokenId: 226701642, tokenName:  });
database.writeLiquidityPool(db, { poolAppId: 26167314, poolAppAccount: "U3VFCRU3WU2CCIZP6Z4ALK3ZGHGPLTJ73Q3GSZK7QXBJUAANK7ORSHDVAA", poolTokenId: 6795477, poolLPTokenId: 26167319, poolType: "VRC200", poolMgr: "NOMADEX" });