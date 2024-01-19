import Database from 'better-sqlite3';

export const initDB = (filename) => {
    return new Database(filename);
}

// Function to create tables
export const createTables = async (db) => {
    await db.exec(`CREATE TABLE IF NOT EXISTS transactions (
            transaction_id TEXT PRIMARY KEY,
            token_id INTEGER,
            amount INTEGER,
            from_wallet TEXT,
            to_wallet TEXT,
            from_balance UNSIGNED INTEGER,
            to_balance UNSIGNED INTEGER,
            block UNSIGNED INTEGER,
            timestamp TEXT
        );`);

    // create tokens table
    // token_type = VRC200 | VSA
    await db.exec(`CREATE TABLE IF NOT EXISTS tokens (
                token_id INTEGER PRIMARY KEY,
                token_name TEXT,
                token_symbol TEXT,
                token_decimals UNSIGNED INTEGER,
                token_supply TEXT,
                token_type TEXT
            );`);

    // create liquidity pools table
    // pool_mgr = NOMADEX | ?
    await db.exec(`CREATE TABLE IF NOT EXISTS liquidity_pools (
                pool_app_id INTEGER PRIMARY KEY,
                pool_app_account TEXT,
                pool_token_id UNSIGNED INTEGER,
                pool_lptoken_id UNSIGNED INTEGER,
                pool_type TEXT,
                pool_mgr TEXT
            );`);

    // create swap table
    await db.exec(`CREATE TABLE IF NOT EXISTS swaps (
                swap_id INTEGER PRIMARY KEY,
                swap_app_id INTEGER,
                swap_app_account TEXT,
                swap_token_from UNSIGNED INTEGER,
                swap_token_to UNSIGNED INTEGER,
                swap_type TEXT
            );`);
}

export const writeTransaction = (db, transaction) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO transactions (transaction_id, token_id, amount, from_wallet, to_wallet, from_balance, to_balance, block, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(transaction.transaction_id, transaction.token_id, transaction.amount, transaction.from_wallet, transaction.to_wallet, transaction.from_balance, transaction.to_balance, transaction.block, transaction.timestamp);
}

export const writeToken = (db, token) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO tokens (token_id, token_name, token_symbol, token_decimals, token_supply, token_type)
        VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(token.token_id, token.token_name, token.token_symbol, token.token_decimals, String(token.token_supply), token.token_type);
}

export const writeLiquidityPool = (db, pool) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO liquidity_pools (pool_app_id, pool_app_account, pool_token_id, pool_lptoken_id, pool_type, pool_mgr)
        VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(pool.pool_app_id, pool.pool_app_account, pool.pool_token_id, pool.pool_lptoken_id, pool.pool_type, pool.pool_mgr);
}

export const writeSwap = (db, swap) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO swaps (swap_id, swap_app_id, swap_app_account, swap_token_from, swap_token_to, swap_type)
        VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(swap.swapId, swap.swapAppId, swap.swapAppAccount, swap.swapTokenFrom, swap.swapTokenTo, swap.swapType);
}

// get list of tokens from tokens table, type as argument
export const getTokens = (db, type) => {
    const stmt = db.prepare(`SELECT * FROM tokens WHERE token_type = ?`);

    const data = [];
    for (const row of stmt.iterate(type)) {
        data.push(row);
    }
    return data;
}

// get max block from transactions table
export const getStartRound = (db, tokenId) => {
    const stmt = db.prepare(`SELECT MAX(block) as max_block FROM transactions WHERE token_id = ?`);
    return stmt.get(tokenId)['max_block']??0;
}