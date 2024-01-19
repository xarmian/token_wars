import algosdk from 'algosdk';
import * as database from './database.js';

export const algodClient = new algosdk.Algodv2("", "https://testnet-api.voi.nodly.io", 443);
export const indexerClient = new algosdk.Indexer("", "https://testnet-idx.voi.nodly.io", 443);

const defaultDbName = "tokenWars.db";
export const db = database.initDB(defaultDbName);

