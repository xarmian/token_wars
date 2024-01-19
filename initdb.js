// initialize sqlite database using argument name as DB file
// using database.js to create database tables
import * as database from './database.js';
import { db } from './config.js';

await database.createTables(db);

database.writeToken(db, { token_id: 6795477, token_name: "Taco", token_symbol: "TACO", token_decimals: 0, token_supply: 10_000_000_000, token_type: "VRC200" });
database.writeLiquidityPool(db, { pool_app_id: 26167314, pool_app_account: "U3VFCRU3WU2CCIZP6Z4ALK3ZGHGPLTJ73Q3GSZK7QXBJUAANK7ORSHDVAA", pool_token_id: 6795477, pool_lptoken_id: 26167319, pool_type: "VRC200", pool_mgr: "NOMADEX" });