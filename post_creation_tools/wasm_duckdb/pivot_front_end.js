/* Front End TODO list:
        DONE: Make column headers dynamic
        DONE: Make basic draggable/droppable GUI
        DONE: Test out a lot of combinations
        DONE: Order by / filter each column

        Make the GUI look good!
        Add a default to values (count) and make editing nicer
        Make filters dynamic by type of data within the column
        Add GUI and support for other parameters (Ex: subtotals or not, subtotals above or below (just ASC vs. DESC in GROUPING() in ORDER BY clause))
        DONE: Freeze panes
        Auto-size the header widths
        Rowspan?
        Allow for Values sigma feature?
            If you do it on the front end, should be able to just re-order the column headers 
            (as long as original name is tracked separately for the prop value)
        

*/
// window.onload = async function() {
//     console.log('Loaded!!');
    
//     const column_list = fetch('http://localhost:3000/column_list?table_name=my_table');

//     column_list.then(async function(column_list_response) {build_filter_list(column_list_response,server_pivot_function);});
//     var table_name = 'my_table';
//     var filters = ''; //TODO
//     var rows = ['category','subcategory'];
//     var columns = ['product_family','product'];
//     var values = ['MAX(revenue)','AVG(inventory)'];
//     await refresh_grid(table_name,filters,rows,columns,values,undefined,server_pivot_function);
    

// };
export async function build_filter_list(column_list, db, server_pivot_function) {
    var available_columns = column_list;
    console.log(available_columns);
    for (var i = 0; i < available_columns.length; i++) {
        var temp_div = document.createElement('div');
        temp_div.className = 'available-column';
        temp_div.innerHTML = available_columns[i].column_name;
        document.getElementById('available-columns-list').appendChild(temp_div);
    }
    dragula([document.getElementById('available-columns-list'),
             document.getElementById('filters-list'),
             document.getElementById('rows-list'),
             document.getElementById('columns-list'),
             document.getElementById('values-list')
        ],{
        copy: function (el, source) {
          return source === document.getElementById('available-columns-list')
        },
        accepts: function (el, target) {
          return target !== document.getElementById('available-columns-list')
        },
        removeOnSpill:true
    }).on('drop', async function (el, target, source, sibling) {
        console.log('In drop event with','el',el,'target',target,'source',source,'sibling',sibling);
        if (target.id == 'values-list') {
            //Don't want to refresh immediately - want to prompt for what type of aggregatation to do
            el.innerText = 'COUNT('+el.innerText+')';
            el.contentEditable = "true";
            el.focus();
            console.log('Done setting up values item');
            el.addEventListener('blur',async function(event){
                console.log('values blur');
                await get_inputs_refresh_grid(db, server_pivot_function);
            });
        } else {
            await get_inputs_refresh_grid(db, server_pivot_function);
        }
        
    }).on('remove', async function (el) {
        await get_inputs_refresh_grid(db, server_pivot_function);
    });
}
export async function get_inputs_refresh_grid(db, server_pivot_function) {
    var table_name = 'my_table';
    var filters = ''; //TODO
    var rows=[];
    for (var i=0; i < document.getElementById('rows-list').children.length; i++) {
        rows.push(document.getElementById('rows-list').children[i].innerText);
    }
    var columns = [];
    for (var i=0; i < document.getElementById('columns-list').children.length; i++) {
        columns.push(document.getElementById('columns-list').children[i].innerText);
    }
    var values = [];
    for (var i=0; i < document.getElementById('values-list').children.length; i++) {
        values.push(document.getElementById('values-list').children[i].innerText);
    }
    await refresh_grid(db, table_name,filters,rows.toString(),columns.toString(),values.toString(),undefined,server_pivot_function)
}
export async function refresh_grid(db, table_name,filters,rows,columns,values,row_subtotals=1,pivot_function=undefined) {
    const column_separator = ' | ';
    
    //There is no db to pass in, but we need it for compatibility with the function signature needed in WASM DuckDB
    let pivoted_data =  await pivot_function(db,table_name,filters,rows,columns,values,row_subtotals);

    const grid = document.querySelector('revo-grid');
    grid.resize = true;
    grid.autoSizeColumn = {
        mode: 'autoSizeAll',
        allColumns: true,
        preciseSize: true
    };
    // grid.filter = true; //This is handled directly in the html
    grid.readonly = true;
    grid.theme = "default";
    
    grid.columns = build_columns(pivoted_data,column_separator);
    // grid.columns = dummy_build_columns();
    grid.source = pivoted_data;

}
export async function server_pivot_function(db,table_name,filters,rows,columns,values,row_subtotals=1) {
    const response = await fetch('http://localhost:3000/pivot?table_name='+table_name+
                                 '&rows='+rows+
                                 '&columns='+columns+
                                 '&values='+values +
                                 '&row_subtotals='+row_subtotals);

    return response.json();
}
export function build_columns(pivoted_data, column_separator) {
    var output_columns = [];
    var sql_headers = [];
    //parse/stringify needed to remove the Arrow metadata column "size" from the grid output
    for (var column in JSON.parse(JSON.stringify(pivoted_data[0]))) {
        sql_headers.push(column);
    }

    var split_sql_headers = [];
    for (var i=0; i < sql_headers.length; i++) {
        split_sql_headers.push(sql_headers[i].split(column_separator));
    }

    //Because we are always doing all combinations of things, I know the depth will be consistent for every column that has a separator
    //(headers in the "rows" parameter don't have a separator so they have a depth of 1)
    //I also know that as soon as I find a column with a depth > 1, all other columns will have that depth

    var max_depth;
    var depth;
    var current_level;
    var column_size = 150;

    var delta_found = false;
    var found_last_pin = false;
    for (var i=0; i < split_sql_headers.length; i++) {
        delta_found = false
        max_depth = split_sql_headers[i].length;
        if (max_depth == 1) {
            output_columns.push({name:sql_headers[i],prop:sql_headers[i], size:column_size, sortable:true, pin:'colPinStart'})      
            continue;
        }

        for (depth=0; depth < max_depth; depth++) {
            // console.log('split_sql_headers[i][depth]',split_sql_headers[i][depth]);
            
            if (depth == 0) {
                // current_level = output_columns.at(-1);
                current_level = output_columns;
            }
            // console.log('output_columns',output_columns);
            // console.log('current_level',current_level);
            var match = find_match_in_array_of_obj(current_level,'name',split_sql_headers[i][depth])
            if (typeof match == 'undefined') {
                if (depth == (max_depth - 1)) {
                    current_level.push({name:split_sql_headers[i][depth], prop:sql_headers[i], size:column_size, sortable:true});
                    break;
                } else {
                    current_level.push({name:split_sql_headers[i][depth], children: []});
                }  
                current_level = current_level.at(-1).children;
            } else {
                current_level = match.children;
            }
        }
    }

    return output_columns;

}
function find_match_in_array_of_obj(my_array, key, value) {
    for (var i=0; i < my_array.length; i++) {
        if(my_array[i][key] == value) return my_array[i];
    }
    return undefined;
}
export function dummy_build_columns() {
    var column_size = 125;
    //Maybe I can build my own size by taking the length of the deepest node's name and multiplying by 7px?
    //Can I do this with a loop instead of recursively? I can just look back and see if we are at the final depth and if it has changed since the last one?
    /*
        for column in columns:
            for j in depth:
                if column_part 1 != prior_column_part_1 then create a name:'column_part_1' with everything up to this point?

    */
    return [
        {name:'category', prop: 'category'},
        {name:'subcategory', prop: 'subcategory'},
        {
            name: 'Flintstones', children: [
                {name: 'Rock 1', children: [
                    {name: 'AVG(inventory)', prop: 'Flintstones | Rock 1 | AVG(inventory)', size:column_size},
                    {name: 'MAX(revenue)', prop: 'Flintstones | Rock 1 | MAX(revenue)', size:column_size}
                ]},
                {name: 'Rock 2', children: [
                    {name: 'AVG(inventory)', prop: 'Flintstones | Rock 2 | AVG(inventory)', size:column_size},
                    {name: 'MAX(revenue)', prop: 'Flintstones | Rock 2 | MAX(revenue)', size:column_size}
                ]}
            ]
        },
        {
            name: 'Jetsons', children: [
                {name: 'Laser 1', children: [
                    {name: 'AVG(inventory)', prop: 'Jetsons | Laser 1 | AVG(inventory)', size:column_size},
                    {name: 'MAX(revenue)', prop: 'Jetsons | Laser 1 | MAX(revenue)', size:column_size}
                ]},
                {name: 'Laser 2', children: [
                    {name: 'AVG(inventory)', prop: 'Jetsons | Laser 2 | AVG(inventory)', size:column_size},
                    {name: 'MAX(revenue)', prop: 'Jetsons | Laser 2 | MAX(revenue)', size:column_size}
                ]}
            ]
        }
    ]

}

