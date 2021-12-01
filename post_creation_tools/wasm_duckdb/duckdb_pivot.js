import * as duckdb from './duckdb-browser.mjs';
import {dummy_build_columns, build_filter_list, refresh_grid, server_pivot_function} from './pivot_front_end.js'

(async () => {
    try {
        const DUCKDB_CONFIG = await duckdb.selectBundle({
            asyncDefault: {
                mainModule: './duckdb.wasm',
                mainWorker: './duckdb-browser.worker.js',
            },
            asyncNext: {
                mainModule: './duckdb-next.wasm',
                mainWorker: './duckdb-browser-next.worker.js',
            },
        });

        const logger = new duckdb.ConsoleLogger();
        const worker = new Worker(DUCKDB_CONFIG.mainWorker);
        const db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(DUCKDB_CONFIG.mainModule, DUCKDB_CONFIG.pthreadWorker);

        const conn = await db.connect();
        var test_output = await conn.query(`SELECT count(*)::INTEGER as v FROM generate_series(0, 100) t(v)`);
        console.log(test_output.toArray());
        await conn.close();
        await db.terminate();
        await worker.terminate();
    } catch (e) {
        console.error(e);
    }
})();
async function replicate_server_pivot() {
    // console.log('dummy_build_columns:',dummy_build_columns());
    var my_column_list = await fetch('http://localhost:3000/column_list?table_name=my_table');
    my_column_list = await my_column_list.json();
    build_filter_list(my_column_list, undefined, server_pivot_function);
    var table_name = 'my_table';
    var filters = ''; //TODO
    var rows = ['category','subcategory'];
    var columns = ['product_family','product'];
    var values = ['MAX(revenue)','AVG(inventory)'];
    await refresh_grid(undefined,table_name,filters,rows,columns,values,undefined,server_pivot_function);
};
// replicate_server_pivot();

async function set_up_client_pivot() {
    var startDate = new Date();
    //Instantiate the DB and save it
    var db_obj = await create_db_obj();
    console.log('db_obj',db_obj)
    var endDate   = new Date();
    console.log('Finished connecting to database after ',(endDate.getTime() - startDate.getTime()) / 1000,' seconds');
    var startDate = new Date();

    //Create dummy data
    var table_name = 'my_table';
    //30000 yields ~1 million rows
    var table_create_message = await create_example_table(db_obj.conn, table_name,30000); //Use 0 to get no modification
    // console.log(JSON.parse(table_create_message.toArray()));
    console.log(arrow_to_array_of_json(table_create_message));
    var endDate   = new Date();
    console.log('Finished creating table after ',(endDate.getTime() - startDate.getTime()) / 1000,' seconds');
    var startDate = new Date();

    //Pull the column list
    var my_column_list = arrow_to_array_of_json(await column_list(db_obj.conn, table_name));
    console.log(my_column_list);

    //Populate the field-list pane
    //Need to have the server-side pivot function set up first (since I pass that in so that events fire it)
    build_filter_list(my_column_list, db_obj.conn, client_pivot);
    var table_name = 'my_table';
    var filters = ''; //TODO
    var rows = ['category','subcategory'].toString();
    var columns = ['product_family','product'].toString();
    var values = ['MAX(revenue)','AVG(inventory)'].toString();
    await refresh_grid(db_obj.conn,table_name,filters,rows,columns,values,undefined,client_pivot);

}
set_up_client_pivot();
async function create_db_obj() {
    try {
        const DUCKDB_CONFIG = await duckdb.selectBundle({
            asyncDefault: {
                mainModule: './duckdb.wasm',
                mainWorker: './duckdb-browser.worker.js',
            },
            asyncNext: {
                mainModule: './duckdb-next.wasm',
                mainWorker: './duckdb-browser-next.worker.js',
            },
        });

        const logger = new duckdb.ConsoleLogger();
        const worker = new Worker(DUCKDB_CONFIG.mainWorker);
        const db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(DUCKDB_CONFIG.mainModule, DUCKDB_CONFIG.pthreadWorker);
        return {'worker':worker, 'db':db,'conn':await db.connect()};

    } catch (e) {
        console.error(e);
        throw(e);
    }
}
async function run_query(conn,sql,params=undefined) {
    //If params is undefined, just run the sql query directly
    if (typeof params == 'undefined') return (await conn.query(sql)).toArray();
    
    //If params is not undefined, use a prepared statement
    const stmt = await conn.prepare(sql);
    return (await stmt.query(...params)).toArray();

}
function arrow_to_array_of_json(table) {
    var json_array = [];
    // var arrow_array = table.toArray();
    var arrow_array = table;
    for (var i=0; i < arrow_array.length; i++) {
        json_array.push(arrow_array[i].toJSON());
    }
    return json_array;
}
function clean_query_parameter(parameter) {
    //Super basic - just prevent drops, inserts, updates, and semicolons.
    if (typeof parameter == 'number') return parameter;

    //If you want to have a column with one of these keywords in the name, then it can't be at the end of that name (until I add double quoting).
    return parameter.replace(/;/gi,'')
    //TODO: Add in replacements to remove comments
                    // .replace(/\/\*/gi,'')
                    // .replace(/--/gi,'')
                    .replace(/drop /gi, '')
                    .replace(/update /gi, '')
                    .replace(/insert /gi, '')
                    .replace(/delete /gi, '')
                    .replace(/alter /gi, '')
                    .replace(/create /gi, '')
                    .replace(/copy /gi, '');
}
async function create_example_table(db=undefined, table_name='my_table', scale_factor) {
    //example is 36 rows
    var sql = `CREATE TABLE my_table AS SELECT  'A' AS category,  'X' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  10 AS revenue,  99 AS inventory UNION ALL SELECT  'A' AS category,  'Y' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  20 AS revenue,  199 AS inventory UNION ALL SELECT  'A' AS category,  'Z' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  30 AS revenue,  299 AS inventory UNION ALL SELECT  'B' AS category,  'X' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  40 AS revenue,  399 AS inventory UNION ALL SELECT  'B' AS category,  'Y' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  50 AS revenue,  499 AS inventory UNION ALL SELECT  'B' AS category,  'Z' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  60 AS revenue,  599 AS inventory UNION ALL SELECT  'C' AS category,  'X' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  70 AS revenue,  699 AS inventory UNION ALL SELECT  'C' AS category,  'Y' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  80 AS revenue,  799 AS inventory UNION ALL SELECT  'C' AS category,  'Z' AS subcategory,  'Flintstones' AS product_family,  'Rock 1' AS product,  90 AS revenue,  899 AS inventory UNION ALL SELECT  'A' AS category,  'X' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  100 AS revenue,  999 AS inventory UNION ALL SELECT  'A' AS category,  'Y' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  110 AS revenue,  1099 AS inventory UNION ALL SELECT  'A' AS category,  'Z' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  120 AS revenue,  1199 AS inventory UNION ALL SELECT  'B' AS category,  'X' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  130 AS revenue,  1299 AS inventory UNION ALL SELECT  'B' AS category,  'Y' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  140 AS revenue,  1399 AS inventory UNION ALL SELECT  'B' AS category,  'Z' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  150 AS revenue,  1499 AS inventory UNION ALL SELECT  'C' AS category,  'X' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  160 AS revenue,  1599 AS inventory UNION ALL SELECT  'C' AS category,  'Y' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  170 AS revenue,  1699 AS inventory UNION ALL SELECT  'C' AS category,  'Z' AS subcategory,  'Flintstones' AS product_family,  'Rock 2' AS product,  180 AS revenue,  1799 AS inventory UNION ALL SELECT  'A' AS category,  'X' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  10000 AS revenue,  990 AS inventory UNION ALL SELECT  'A' AS category,  'Y' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  20000 AS revenue,  1990 AS inventory UNION ALL SELECT  'A' AS category,  'Z' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  30000 AS revenue,  2990 AS inventory UNION ALL SELECT  'B' AS category,  'X' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  40000 AS revenue,  3990 AS inventory UNION ALL SELECT  'B' AS category,  'Y' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  50000 AS revenue,  4990 AS inventory UNION ALL SELECT  'B' AS category,  'Z' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  60000 AS revenue,  5990 AS inventory UNION ALL SELECT  'C' AS category,  'X' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  70000 AS revenue,  6990 AS inventory UNION ALL SELECT  'C' AS category,  'Y' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  80000 AS revenue,  7990 AS inventory UNION ALL SELECT  'C' AS category,  'Z' AS subcategory,  'Jetsons' AS product_family,  'Laser 1' AS product,  90000 AS revenue,  8990 AS inventory UNION ALL SELECT  'A' AS category,  'X' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  100000 AS revenue,  9990 AS inventory UNION ALL SELECT  'A' AS category,  'Y' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  110000 AS revenue,  10990 AS inventory UNION ALL SELECT  'A' AS category,  'Z' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  120000 AS revenue,  11990 AS inventory UNION ALL SELECT  'B' AS category,  'X' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  130000 AS revenue,  12990 AS inventory UNION ALL SELECT  'B' AS category,  'Y' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  140000 AS revenue,  13990 AS inventory UNION ALL SELECT  'B' AS category,  'Z' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  150000 AS revenue,  14990 AS inventory UNION ALL SELECT  'C' AS category,  'X' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  160000 AS revenue,  15990 AS inventory UNION ALL SELECT  'C' AS category,  'Y' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  170000 AS revenue,  16990 AS inventory UNION ALL SELECT  'C' AS category,  'Z' AS subcategory,  'Jetsons' AS product_family,  'Laser 2' AS product,  180000 AS revenue,  17990 AS inventory `
    await run_query(db,sql);

    sql = `
        insert into "`+clean_query_parameter(table_name) +`" 
        select 
            t1.category
            ,t1.subcategory
            ,t1.product_family
            ,t1.product
            ,t1.revenue + t2.i as revenue
            ,t1.inventory + t2.i as inventory
        from "`+clean_query_parameter(table_name) +`" t1 
        join generate_series(0,`+clean_query_parameter(scale_factor) + `) t2(i)
            on 1=1
    `
    return run_query(db,sql);
}
async function column_list(db, table_name) {
    var sql = `
    select 
        a.attname as column_name
    from pg_attribute a
    join pg_class c
    on a.attrelid = c.oid
    where
        c.relname = ?::string
    order by
        1
        `

    return run_query(db,sql,[table_name]);
}
async function client_pivot(db,table_name,filters,rows,columns,values,row_subtotals=1) {
    var startDate = new Date();
    
    var pivot_sql = await build_pivot_sql(db, table_name, rows, columns, values, filters, row_subtotals);
    console.log('Pivot SQL statement:\n',pivot_sql);
    var pivot_output = await run_query(db,pivot_sql)
    var endDate   = new Date();
    console.log('Finished pivot operation after ',(endDate.getTime() - startDate.getTime()) / 1000,' seconds');
    return pivot_output;
}
async function build_pivot_sql(db,table_name,rows=undefined, columns=undefined, values=undefined, filters=undefined,
                               row_subtotals=1) {
    //Note: Build up each clause in 2 layers:
    //      First build up each individual row of text in the query
    //      Then do a text concatenation at the clause-ish level (rows separate from distinct_columns...)
    //      Then union them all together, but have a where clause to not include clauses that aren't needed
    //      Then do a final concatenation
    //The SQL used to build up the SQL statement will be lower case. The SQL I generate will have upper case keywords.
    //TODO: Add in WITH ORDINALITY a(rows, row_order) to enforce order on the unnest clause for rows
    if (typeof values == 'undefined' || values == '') values = 'COUNT(*)'

    var pre_columns_sub_clause = await build_pre_column_sub_clause(db, table_name, columns, values, filters);
    console.log(pre_columns_sub_clause);
    // return run_query(db,columns_sub_clause);

    var sql = `
        with rows as (
            select 
                unnest(['`+clean_query_parameter(rows.replace(/,/g,"','"))+`']) as rows
                , `+clean_query_parameter(row_subtotals)+` as row_subtotals
        ), rows_sub_clause as (
            select 
                case when row_subtotals = 0 then rows 
                else 'CASE WHEN GROUPING(' || rows || ') = 1 then ''Total'' else '|| rows || ' end as ' || rows
                end as rows_sub_clause
            from rows
            where
                rows != ''
        ), values as (
            select 
                unnest(['`+clean_query_parameter(values.replace(/,/g,"','"))+`']) as values
        ), pre_columns_sub_clause as (
            `+pre_columns_sub_clause+`
        ), columns_sub_clause as (
            select
                values || pre_columns_sub_clause || ' | ' || values || '"' as columns_sub_clause
            from pre_columns_sub_clause
            join values on 1=1
        ), select_clause as (
            select
                'SELECT
                ' ||
                string_agg(
                    sub_clause
                , '\n, ') as select_clause
            from (
                select 
                    clause_order
                    , sub_clause
                from (
                    select 1 as clause_order, rows_sub_clause as sub_clause from rows_sub_clause union all
                    select 2 as clause_order, columns_sub_clause as sub_clause from columns_sub_clause 
                ) sub_clauses
                order by
                    clause_order
            ) sub_clauses
            
        ), from_clause as (
            select ' FROM ' || '"` + clean_query_parameter(table_name) + `"' as from_clause
        ), group_by_clause as (
            select 
                min(case when row_subtotals = 0 then 'GROUP BY '
                else ' GROUP BY ROLLUP ('
                end)
                || string_agg(rows,',') ||
                min(case when row_subtotals = 0 then ''
                else ')'
                end) as group_by_clause
            from rows
        ), order_by_clause as (
            select 
                min(' ORDER BY ')
                || string_agg(
                    case when row_subtotals = 0 then rows
                    else 'GROUPING(' || rows || '), ' || rows 
                    end
                , ', ') as order_by_clause
            from rows
        ), all_clauses as (
            select 1 as clause_order, select_clause::varchar as clause from select_clause union all
            select 2 as clause_order, from_clause::varchar as clause from from_clause union all
            select 3 as clause_order, group_by_clause::varchar as clause from group_by_clause where trim(group_by_clause) not in ('GROUP BY','GROUP BY ROLLUP ()') union all
            select 4 as clause_order, order_by_clause::varchar as clause from order_by_clause where trim(order_by_clause) not in ('ORDER BY','ORDER BY GROUPING(),')
        )
        
        select 
            string_agg(clause, '
            ') as clauses
        from (select * from all_clauses order by clause_order) clauses
        
    `
    console.log(sql);
    var query_output = await run_query(db,sql)
    return query_output[0].clauses;
    // return query_output;
}

async function build_pre_column_sub_clause(db, table_name, columns=undefined, values=undefined, filters=undefined) {
    
    //TODO: I need to add in the column name portion
    //      Then I need to pull in the AVG(revenue) stuff. 
    //Basically, I need a fully baked AVG(revenue) FILTER (WHERE x = 'a' and y = 'b') as "a | b | AVG(revenue)"
    //Then go back to the build_sql_pivot portion and integrate this in with that (should just be a single string_agg with commas between the rows and columns)
    if (typeof columns == 'undefined' || columns == '') {
        return `
        SELECT ' AS "' AS pre_columns_sub_clause 
        `
    }
    var sql = `
    WITH columns as (
        select 
            unnest(['`+clean_query_parameter(columns.replace(/,/g,"','"))+`']) as columns
            
    ), distinct_columns as (
        select
            row_number() over (order by `+clean_query_parameter(columns)+`) as distinct_order
            , distinct_columns.*
        from (
            select distinct
                `+clean_query_parameter(columns)+`
            from "`+clean_query_parameter(table_name)+`"
        ) distinct_columns
    ), filter_where_clause as (
        --, MAX(revenue) FILTER (WHERE product_family = 'Flintstones' AND product = 'Rock 1') as "Flintstones | Rock1 | MAX(revenue)"
        select
            'SELECT ' ||
            ''' FILTER ( WHERE '' || ' ||
                string_agg('
                ''' || columns || ' = '''''' || ' || columns || ' ||''''''''' 
                , ' || '' AND '' || ') ||
            ' || '')'' ' ||
            ' || '' AS  "'' || ' || 
                string_agg('
                    '''' || ' || columns || ' ||''''' 
                    , ' || '' | '' || ') ||
            
            --Don't include the " at this layer since I need to add AVG(revenue) in the subsequent query
            
            ' AS pre_columns_sub_clause' ||
            ' 
            FROM ' || '(
                SELECT
                    row_number() over (order by `+clean_query_parameter(columns)+`) as distinct_order
                    , distinct_columns.*
                FROM (
                    SELECT distinct
                        `+clean_query_parameter(columns)+`
                    FROM "`+clean_query_parameter(table_name)+`"
                ) distinct_columns
            ) numbered_distinct_columns
            ' as clauses
        from columns
    )
    select * from filter_where_clause
    `
    console.log(sql);
    var query_output = await run_query(db,sql);
    // console.log(query_output);
    return query_output[0].clauses;
}