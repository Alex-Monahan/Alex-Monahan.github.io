console.log('Got to the start');
// Import the ESM bundle (supports tree-shaking)
import * as duckdb from 'https://alex-monahan.github.io/node_modules/@duckdb/duckdb-wasm/dist/duckdb-esm.js';
        
// Either bundle them manually, for example as Webpack assets
import duckdb_wasm from 'https://alex-monahan.github.io/node_modules/@duckdb/duckdb-wasm/dist/duckdb.wasm';
import duckdb_wasm_next from 'https://alex-monahan.github.io/node_modules/@duckdb/duckdb-wasm/dist/duckdb-next.wasm';
import duckdb_wasm_next_coi from 'https://alex-monahan.github.io/node_modules/@duckdb/duckdb-wasm/dist/duckdb-next-coi.wasm';

// ..., or load the bundles from jsdelivr
const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

// Select a bundle based on browser checks
const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
// Instantiate the asynchronus version of DuckDB-Wasm
const worker = new Worker(bundle.mainWorker);
const logger = new duckdb.ConsoleLogger();
const db = new duckdb.AsyncDuckDB(logger, worker);
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
console.log('Got to the end');