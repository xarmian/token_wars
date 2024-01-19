import { db } from './config.js';
import * as database from './database.js';
import Database from 'better-sqlite3';

// select the count of all transactions with unique from and to wallets within a specified block range
function getUniqueWalletCount(db, tokenId, minBalance, startBlock, endBlock) {
    const stmt = db.prepare(`SELECT COUNT(*) as unique_counterparties
                            FROM (
                                SELECT 
                                    CASE 
                                        WHEN from_wallet < to_wallet THEN from_wallet || '-' || to_wallet 
                                        ELSE to_wallet || '-' || from_wallet 
                                    END as wallet_pair
                                FROM transactions
                                WHERE block BETWEEN ? AND ? AND token_id = ? AND to_balance >= ?
                                GROUP BY wallet_pair
                            ) AS unique_pairs`);
    return stmt.get(startBlock, endBlock , tokenId, minBalance);
}

let tokenId = 6778021; // VRC200
let minBalance = 1000000; // 1 VOI
let startBlock = 0;
let endBlock = 10000000;

console.log(getUniqueWalletCount(db, tokenId, minBalance, startBlock, endBlock));