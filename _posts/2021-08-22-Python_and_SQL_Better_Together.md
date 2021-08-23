<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WMXE9T6LL9"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WMXE9T6LL9');
</script>
<img src="..\..\..\..\images\python_and_sql_cropped.png" width="650" style="max-width: 650px">

# Python and SQL: Better Together

#### Python and SQL are complementary - we should focus on how best to integrate them rather than try to replace them!
 
**By Alex Monahan**   
**2021-08-15** (Yes, this is the one date format to rule them all)  
    [LinkedIn](https://www.linkedin.com/in/alex-monahan-64814292/)   
    [Twitter @\_\__alexmonahan\_\__](https://twitter.com/__alexmonahan__?lang=en)   
    The views I express are my own and not my employer's.  

Welcome to my first blog post! I welcome any and all feedback over on Twitter - I'd love to learn from all of you!

There has been some spirited debate over SQL on Tech Twitter in the last few weeks. I am a huge fan of open discussions like this, and I consistently learn something when reading multiple viewpoints. It's my hope to contribute to a friendly and productive dialog with fellow data folks! Let's focus on a few positives from each perspective.

[Here, Jamie Brandon makes some excellent points about SQL's weaknesses.](https://scattered-thoughts.net/writing/against-sql) The points I agree with the most are related to SQL's incompressibility. The way I encounter this most frequently is that it is difficult to execute queries on a dynamic list of columns purely in SQL. I also wish that it was easier to modularize code into functions in more powerful way, although there are some ways of doing so. Imagine a repository of SQL helper functions you could import! If only it were possible. If it is, please let me know on Twitter!

[Pedram Navid responded to those points in an indirect way that I also found to be very impactful and thought provoking.](https://pedram.substack.com/p/for-sql) Pedram focused on the organizational impacts of choosing to move away from SQL. I agree with Pedram that SQL is a tremendous data democratization tool and that it is important that SQL folks and other programming language folks work as a team. He also makes the case that SQL is often good enough, and I would go a step further and say there are many cases where SQL is a very expressive way to request and manipulate data! The cases where SQL is most useful are very accessible and can really empower people where data is just a portion of their job. **SQL is the easiest to learn superpower as a data person!** 

Pedram also cites dbt as a powerful way to address some of SQL's rough edges. I would like to take that line of thinking a step further here: **How can we mix and match Python and SQL to get the best of both?**
<br>
<br> 

## Why use SQL?

<img src="..\..\..\..\images\stackoverflow_survey_programming_languages_pros.png" width="650" style="max-width: 650px">

Before mixing and matching, why would we want to use SQL in the first place? While I agree with Jamie that it is imperfect, it has many redeeming qualities! Toss any others I've forgotten on Twitter!


1. SQL is very widely used  
    * [It ranks 3rd in the Stack Overflow survey (see above graph!)](https://insights.stackoverflow.com/survey/2020#most-popular-technologies), and [it was invented all the way back in 1979](https://docs.oracle.com/cd/B19306_01/server.102/b14200/intro001.htm#:~:text=In%201979%2C%20Relational%20Software%2C%20Inc,as%20the%20standard%20RDBMS%20language.)!  
    * Excel and nearly every Business Intelligence tool provide a SQL interface. Plus Python's standard library includes SQLite, which is in the [top 5 most widely deployed pieces of software in existence!](https://www.sqlite.org/mostdeployed.html)  
    * I also agree with Erik Bernhardsson's blog post [I don't want to learn your garbage query language](https://erikbern.com/2018/08/30/i-dont-want-to-learn-your-garbage-query-language.html). Let's align on SQL so we only have to learn or develop things once!
    

2. The use of SQL is expanding  
    * The growth of cloud data warehouses is a huge indication of the power of SQL. [Stream processing is adding SQL support](https://www.confluent.io/product/ksql/), and the [SQL language itself continues to grow](https://modern-sql.com/) in power and flexibility.   
    
    
3. SQL is easy to get started with  
    * While I don't necessarily have sources to cite here, I have led multiple SQL training courses that can take domain experts from 0 to introductory SQL in 8 hours. While I have not done the same for other languages, I feel like it would be difficult to be productive that quickly!  
    
    
4. However, it's hard to outgrow the need for SQL  
    * Even the majority of data scientists use SQL "Sometimes" or more - placing it as the number 2 language in [Anaconda's State of Data Science 2021](https://www.anaconda.com/state-of-data-science-2021).  
    * **This also makes SQL great for your career!**  
    
    
5. SQL's declarative nature removes the need to understand database internals  
    * The deliberate separation between the user's request and the specific algorithms used by the database is an excellent abstraction layer 99%+ of the time. You can write years of productive SQL queries before learning the difference between a hash join and a sorted merge loop join! And even then, the database will usually choose correctly on your behalf.
    
    
6. Chances are good you need to use SQL to pull your data initially anyway  
    * If you already need to know some SQL to access your company's valuable info, why not maximize your effectiveness with it?
<br>
<br>

## Tools to use when combining SQL and Python

<img src="..\..\..\..\images\swiss_army_knife.jpg" width="300" style="max-width: 300px;margin-left: auto;margin-right: auto;display: block;">

#### Asterisks indicate libraries I have not used yet, but that I am excited to try!

* [DuckDB](https://duckdb.org/)
    * Think of this as SQLite for analytics! I list the many pros of DuckDB below. It is my favorite way to mix and match SQL and Pandas.
* [SQLite](https://www.sqlite.org/index.html)
    * SQLite is an easy way to process larger than memory data in Python. It comes bundled in the standard library.
    * There are a few drawbacks that DuckDB addresses:
        * Slow performance for analytics (row-based instead of columnar like Pandas and DuckDB)
        * Requires data to be inserted into SQLite before executing a query on it
        * Overly flexible data types (This is debatable, but it makes it harder to interact with Pandas in my experience)
* [SQLAlchemy](https://www.sqlalchemy.org/)
    * SQLAlchemy can connect to tons of different databases. It's a huge advantage for the Python ecosystem.
    * When used in combination with pandas.read_sql, SQLAlchemy can pull from a SQL DB and load a Pandas DataFrame.
    * SQLAlchemy is traditionally known for its ORM (Object Relational Mapper) capabilities which allow you to avoid SQL. However, it also has powerful features for SQL fans like safe parameter escaping
    * There are many other tools for querying SQL DB's
        * [pyodbc](https://github.com/mkleehammer/pyodbc) - Uses ODBC drivers for querying which is flexible, but can be slow
        * [turbodbc](https://github.com/blue-yonder/turbodbc)* - Uses Apache Arrow to speed up ODBC connections
        * A variety of DB-specific native connectors (Ex: [cx_oracle](https://github.com/oracle/python-cx_Oracle), [psycopg2](https://github.com/psycopg/psycopg2)) - These are fast, but not universal
* [ipython-sql](https://github.com/catherinedevlin/ipython-sql)
    * Convert a Jupyter cell into a SQL language cell! This enables syntax highlighting for SQL in Jupyter.
    * I find this much nicer than working with SQL in multi-line strings, and you get syntax highlighting without having separate SQL files.
    * This builds on top of SQLAlchemy
    * See an example below!
* [PostgreSQL's PL/Python](https://www.postgresql.org/docs/10/plpython.html)*
    * You can write functions and procedures on Postgres using Python!
    * I think this addresses some of the concerns highlighted by Jamie Brandon, but as popular as Postgres is, it's not a standard feature of all DBs
    * This is a more DB-centric approach. I've found DB stored procedures to be more challenging to use with version control, but they certainly have value
* [Dask-sql](https://github.com/dask-contrib/dask-sql)*
    * Process SQL statements on a Dask cluster (on your local machine or 1000's of servers!)
    * The first bullet in the readme advertises easy Python and SQL interoperability, which sounds great!
    * This comes with some extra complexity over DuckDB - you'll need Java for the Apache Calcite query parser and a few lines of code to set up a Dask cluster. 
    * I'd like to benchmark this a bit to see how well it performs in my single machine use case
* [dbt](https://www.getdbt.com/)*
    * dbt is a way to build SQL pipelines and execute jinja-templated SQL 
    * The templating seems like a powerful way to avoid some of SQL's pain points like a rigid set of columns and requiring columns be specified in the SELECT and GROUP BY clauses. 
    * dbt also works well with version control systems
    * I am very excited to try it out, but I am not a cloud data warehouse user so I am slightly outside their target audience
    * There are [adapters](https://docs.getdbt.com/docs/available-adapters) for both [DuckDB](https://github.com/jwills/dbt-duckdb) and [Clickhouse](https://github.com/silentsokolov/dbt-clickhouse) (A fast, massively popular open source columnar data warehouse) so this should perform well. These are both community maintained, so I'll just need to test them out a bit!  

#### I plan to explore more of these in upcoming posts!
<br>
<br>    

## DuckDB - One powerful way to mix Python and SQL

<img src="..\..\..\..\images\duckdb_logo_screenshot.png" width="650" style="max-width: 650px">

[DuckDB](https://duckdb.org/) is best summarized as the SQLite of analytics. In under 10ms, you can spin up your own in-process database that is 20x faster than SQLite, and [in most cases faster than Pandas](https://duckdb.org/2021/05/14/sql-on-pandas.html)! 

Besides the speed, why do I love DuckDB?
1. It works seamlessly with Pandas  
    * You can query a DataFrame without needing to insert it into the DB, and you can return results as DF's as well. This is both simple and very fast since it is in the same process as Python. 
    
    
2. Setup is easy  
    * Just pip install duckdb and you're all set. 
    
    
3. DuckDB supports almost all of PostgreSQL's syntax, but also smooths rough edges  
    * When I first tested out DuckDB, it could handle everything I threw at it: Recursive CTE's, Window functions, arbitrary subqueries, and more. Even lateral joins are supported! Since then, it has only improved by adding Regex, statistical functions, and more!  
    * As an example of smoothing rough edges, Postgres is notoriously picky about capitalization, but DuckDB is not case sensitive. While most function names come from Postgres, many equivalent function names from other DB's can also be used.  
    

4. MIT licensed  


5. Parquet, csv, and Apache Arrow structures can also be queried by DuckDB  
    * Interoperability with Arrow and Parquet in particular expand the ecosystem that DuckDB can interact with.
    

6. DuckDB continues to dramatically improve, and the developers are fantastic!  
    * Truthfully, this should be item 0! I've had multiple (sometimes tricky) bugs be squashed in a matter of days, and many of my feature requests have been added. The entire team is excellent!
    

7. Persistence comes for free, but is optional! This allows DuckDB to work on larger-than-memory data.  
    * If you are building a data pipeline, it can be super useful to see all of the intermediate steps. Plus, I believe that DuckDB databases are going to become a key multi-table data storage structure, just as SQLite is today. The developers are in the midst of adding some powerful compression to DuckDB's storage engine, so I see significant potential here.
    

8. Did I mention it's fast?  
    * DuckDB is multi-threaded, so you can utilize all your CPU cores without any work on your end - no need to partition your data or anything!
    

9. DuckDB has a Relational API that is targeting Pandas compatibility  
    * While I am admittedly a SQL fan, having a relational API can be very helpful to add in some of the dynamism and flexibility of Pandas. 
<br>
<br>

## An example workflow with DuckDB

```python
#I use Anaconda, so Pandas, and SQLAlchemy are already installed. Otherwise pip install those to start with
# !pip install pandas
# !pip install sqlalchemy

!pip install duckdb==0.2.8

#This is a SQLalchemy driver for DuckDB. It powers the ipython-sql library below 
#Thank you to the core developer of duckdb_engine, Elliana May! 
#She rapidly added a feature and squashed a bug so that it works better with ipython-sql!
!pip install duckdb_engine==0.1.8rc4 

#This allows for the %%sql magic in Jupyter to build SQL language cells!
!pip install ipython-sql
```

```python
import duckdb
import pandas as pd
import sqlalchemy
#no need to import duckdb_engine - SQLAlchemy will auto-detect the driver needed based on your connection string!
```

### Let's play with a moderately sized dataset: a 1.6 GB csv
This analysis is inspired by this [DuckDB intro article by Uwe Korn](https://uwekorn.com/2019/10/19/taking-duckdb-for-a-spin.html) and can be downloaded [here.](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page) Note that DuckDB can handle much larger datasets - this is only an example!

First we load the ipython-sql extension and default our output to be in Pandas DF format. We will also simplify what is printed after each SQL statement.  
Next, we connect to an in-memory DuckDB and set it to use all our available CPU horsepower!

```python
%load_ext sql
%config SqlMagic.autopandas=True
%config SqlMagic.feedback = False
%config SqlMagic.displaycon = False

%sql duckdb:///:memory:
%sql pragma threads=16 
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
</div>



Check out this super clean syntax for directly querying a CSV file! As a note, we could have also used pandas.read_csv and then queried the resulting DataFrame. DuckDB's csv reader allows us to skip a step!

```python
%%sql
create table taxis as
SELECT * FROM 'yellow_tripdata_2016-01.csv';
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>10906858</td>
    </tr>
  </tbody>
</table>
</div>



#### Our csv import took 15 seconds: 40% faster than the 25 seconds Pandas required! 
(the csv was loaded into RAM prior to timing so it may take an extra few seconds in both cases if you weren't already working with that file)

Now let's take a quick sample of our dataset and load it into a Pandas DF.

```python
%%sql
SELECT
    *
FROM taxis
USING SAMPLE 5
```




<div style="overflow:scroll;">
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>VendorID</th>
      <th>tpep_pickup_datetime</th>
      <th>tpep_dropoff_datetime</th>
      <th>passenger_count</th>
      <th>trip_distance</th>
      <th>pickup_longitude</th>
      <th>pickup_latitude</th>
      <th>RatecodeID</th>
      <th>store_and_fwd_flag</th>
      <th>dropoff_longitude</th>
      <th>dropoff_latitude</th>
      <th>payment_type</th>
      <th>fare_amount</th>
      <th>extra</th>
      <th>mta_tax</th>
      <th>tip_amount</th>
      <th>tolls_amount</th>
      <th>improvement_surcharge</th>
      <th>total_amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2</td>
      <td>2016-01-29 17:59:21</td>
      <td>2016-01-29 18:17:50</td>
      <td>2</td>
      <td>2.36</td>
      <td>-73.990707</td>
      <td>40.756535</td>
      <td>1</td>
      <td>N</td>
      <td>-73.991417</td>
      <td>40.735207</td>
      <td>1</td>
      <td>13.0</td>
      <td>1.0</td>
      <td>0.5</td>
      <td>2.96</td>
      <td>0.0</td>
      <td>0.3</td>
      <td>17.76</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>2016-01-06 20:46:10</td>
      <td>2016-01-06 20:49:45</td>
      <td>1</td>
      <td>0.66</td>
      <td>-73.983322</td>
      <td>40.750511</td>
      <td>1</td>
      <td>N</td>
      <td>-73.994217</td>
      <td>40.755001</td>
      <td>1</td>
      <td>4.5</td>
      <td>0.5</td>
      <td>0.5</td>
      <td>1.00</td>
      <td>0.0</td>
      <td>0.3</td>
      <td>6.80</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>2016-01-09 13:23:12</td>
      <td>2016-01-09 13:29:04</td>
      <td>1</td>
      <td>0.50</td>
      <td>-73.994179</td>
      <td>40.751106</td>
      <td>1</td>
      <td>N</td>
      <td>-73.985992</td>
      <td>40.750496</td>
      <td>2</td>
      <td>5.5</td>
      <td>0.0</td>
      <td>0.5</td>
      <td>0.00</td>
      <td>0.0</td>
      <td>0.3</td>
      <td>6.30</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2</td>
      <td>2016-01-28 09:57:02</td>
      <td>2016-01-28 10:04:10</td>
      <td>2</td>
      <td>3.22</td>
      <td>-73.989326</td>
      <td>40.742462</td>
      <td>1</td>
      <td>N</td>
      <td>-74.002136</td>
      <td>40.709290</td>
      <td>1</td>
      <td>11.0</td>
      <td>0.0</td>
      <td>0.5</td>
      <td>1.50</td>
      <td>0.0</td>
      <td>0.3</td>
      <td>13.30</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2</td>
      <td>2016-01-18 20:45:15</td>
      <td>2016-01-18 21:06:36</td>
      <td>1</td>
      <td>13.80</td>
      <td>-74.012917</td>
      <td>40.706169</td>
      <td>1</td>
      <td>N</td>
      <td>-73.939781</td>
      <td>40.852749</td>
      <td>1</td>
      <td>37.5</td>
      <td>0.5</td>
      <td>0.5</td>
      <td>3.80</td>
      <td>0.0</td>
      <td>0.3</td>
      <td>42.60</td>
    </tr>
  </tbody>
</table>
</div>


<br>

As you can see below, DuckDB did a great job auto-detecting our column types. One more traditional DB hassle eliminated!

```python
%sql describe taxis
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Field</th>
      <th>Type</th>
      <th>Null</th>
      <th>Key</th>
      <th>Default</th>
      <th>Extra</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>VendorID</td>
      <td>INTEGER</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>1</th>
      <td>tpep_pickup_datetime</td>
      <td>TIMESTAMP</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>2</th>
      <td>tpep_dropoff_datetime</td>
      <td>TIMESTAMP</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>3</th>
      <td>passenger_count</td>
      <td>INTEGER</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>4</th>
      <td>trip_distance</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>5</th>
      <td>pickup_longitude</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>6</th>
      <td>pickup_latitude</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>7</th>
      <td>RatecodeID</td>
      <td>INTEGER</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>8</th>
      <td>store_and_fwd_flag</td>
      <td>VARCHAR</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>9</th>
      <td>dropoff_longitude</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>10</th>
      <td>dropoff_latitude</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>11</th>
      <td>payment_type</td>
      <td>INTEGER</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>12</th>
      <td>fare_amount</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>13</th>
      <td>extra</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>14</th>
      <td>mta_tax</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>15</th>
      <td>tip_amount</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>16</th>
      <td>tolls_amount</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>17</th>
      <td>improvement_surcharge</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
    <tr>
      <th>18</th>
      <td>total_amount</td>
      <td>DOUBLE</td>
      <td>YES</td>
      <td>None</td>
      <td>None</td>
      <td>None</td>
    </tr>
  </tbody>
</table>
</div>



### Now let's do some analysis! 
First, let's see how we can pass in a parameter through ipython-sql to better understand how VendorId 1 is behaving. Just for fun, we are going to pass in the entire WHERE clause. Why? It shows that you can build up dynamic SQL statements using Python! It's not quite as easy to use as a templating language, but just as flexible.

```python
my_where_clause = """
    WHERE
        vendorid = 1
"""
```

```python
%%sql
SELECT
    vendorid
    ,passenger_count
    ,count(*) as count
    ,avg(fare_amount/total_amount) as average_fare_percentage
    ,avg(trip_distance) as average_distance
FROM taxis
{my_where_clause}
GROUP BY
    vendorid
    ,passenger_count
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>VendorID</th>
      <th>passenger_count</th>
      <th>count</th>
      <th>average_fare_percentage</th>
      <th>average_distance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>0</td>
      <td>303</td>
      <td>0.480146</td>
      <td>3.217492</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>1</td>
      <td>4129971</td>
      <td>0.787743</td>
      <td>6.362515</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>2</td>
      <td>689305</td>
      <td>0.796871</td>
      <td>5.674639</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>3</td>
      <td>164253</td>
      <td>0.804641</td>
      <td>3.126398</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1</td>
      <td>4</td>
      <td>83817</td>
      <td>0.819123</td>
      <td>32.439788</td>
    </tr>
    <tr>
      <th>5</th>
      <td>1</td>
      <td>5</td>
      <td>2360</td>
      <td>0.806479</td>
      <td>3.923771</td>
    </tr>
    <tr>
      <th>6</th>
      <td>1</td>
      <td>6</td>
      <td>1407</td>
      <td>0.788484</td>
      <td>3.875124</td>
    </tr>
    <tr>
      <th>7</th>
      <td>1</td>
      <td>7</td>
      <td>3</td>
      <td>0.755823</td>
      <td>4.800000</td>
    </tr>
    <tr>
      <th>8</th>
      <td>1</td>
      <td>9</td>
      <td>10</td>
      <td>0.785628</td>
      <td>3.710000</td>
    </tr>
  </tbody>
</table>
</div>



Next we'll aggregate our data in DuckDB (which is exceptionally fast for Group By queries), and then pivot the result with Pandas. Pandas is a great fit for pivoting because the column names are not known ahead of time, which would require writing some dynamic SQL. However, DuckDB has a pivot_table function on their roadmap for their Python Relational (read, DataFrame-like) API! This will allow us to pivot larger than memory data and use multiple CPU cores for that pivoting operation.

Note: The more complex the query, the better DuckDB performs relative to Pandas! This is because it can do more work in less passes through the dataset, and because it is using multiple CPU cores. 

```python
%%sql aggregated_df <<
SELECT
    --Aggregate up to a weekly level. lpad makes sure week numbers always have 2 digits (Ex: '02' instead of '2')
    date_part('year',tpep_pickup_datetime) || 
        lpad(cast(date_part('week',tpep_pickup_datetime) as varchar),2,'0') as yyyyww
    ,passenger_count
    ,count(*) as count
    ,min(total_amount) as min_amount
    ,quantile_cont(total_amount,0.1) as _10th_percentile
    ,quantile_cont(total_amount,0.25) as _25th_percentile
    ,quantile_cont(total_amount,0.5) as _50th_percentile
    ,avg(total_amount) as avg_amount
    ,quantile_cont(total_amount,0.75) as _75th_percentile
    ,quantile_cont(total_amount,0.9) as _90th_percentile
    ,max(total_amount) as max_amount
    ,stddev_pop(total_amount) as std_amount
FROM taxis
GROUP BY
    date_part('year',tpep_pickup_datetime) || 
        lpad(cast(date_part('week',tpep_pickup_datetime) as varchar),2,'0')
    ,passenger_count
ORDER BY
    yyyyww
    ,passenger_count
```

    Returning data to local variable aggregated_df
    

```python
aggregated_df
```




<div style="overflow:scroll;height:600px">
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>yyyyww</th>
      <th>passenger_count</th>
      <th>count</th>
      <th>min_amount</th>
      <th>_10th_percentile</th>
      <th>_25th_percentile</th>
      <th>_50th_percentile</th>
      <th>avg_amount</th>
      <th>_75th_percentile</th>
      <th>_90th_percentile</th>
      <th>max_amount</th>
      <th>std_amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>201601</td>
      <td>0</td>
      <td>129</td>
      <td>-160.46</td>
      <td>3.000000e-01</td>
      <td>4.8000</td>
      <td>10.560</td>
      <td>21.901163</td>
      <td>22.5600</td>
      <td>70.019999</td>
      <td>278.30</td>
      <td>45.119609</td>
    </tr>
    <tr>
      <th>1</th>
      <td>201601</td>
      <td>1</td>
      <td>1814315</td>
      <td>-227.10</td>
      <td>6.350000e+00</td>
      <td>8.1800</td>
      <td>11.160</td>
      <td>14.909425</td>
      <td>16.3000</td>
      <td>26.300000</td>
      <td>3045.34</td>
      <td>12.835089</td>
    </tr>
    <tr>
      <th>2</th>
      <td>201601</td>
      <td>2</td>
      <td>361892</td>
      <td>-100.80</td>
      <td>6.800000e+00</td>
      <td>8.3000</td>
      <td>11.620</td>
      <td>15.835135</td>
      <td>17.1600</td>
      <td>29.300000</td>
      <td>1297.75</td>
      <td>14.113061</td>
    </tr>
    <tr>
      <th>3</th>
      <td>201601</td>
      <td>3</td>
      <td>100336</td>
      <td>-80.80</td>
      <td>6.800000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.394737</td>
      <td>16.6200</td>
      <td>27.300000</td>
      <td>1297.75</td>
      <td>14.566035</td>
    </tr>
    <tr>
      <th>4</th>
      <td>201601</td>
      <td>4</td>
      <td>47683</td>
      <td>-120.30</td>
      <td>6.800000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.561985</td>
      <td>16.8000</td>
      <td>28.300000</td>
      <td>889.30</td>
      <td>13.701526</td>
    </tr>
    <tr>
      <th>5</th>
      <td>201601</td>
      <td>5</td>
      <td>138636</td>
      <td>-52.80</td>
      <td>6.360000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.263942</td>
      <td>16.6200</td>
      <td>27.960000</td>
      <td>303.84</td>
      <td>12.353158</td>
    </tr>
    <tr>
      <th>6</th>
      <td>201601</td>
      <td>6</td>
      <td>85993</td>
      <td>-52.80</td>
      <td>6.360000e+00</td>
      <td>8.1900</td>
      <td>11.160</td>
      <td>14.889752</td>
      <td>16.3000</td>
      <td>26.300000</td>
      <td>170.50</td>
      <td>11.906014</td>
    </tr>
    <tr>
      <th>7</th>
      <td>201601</td>
      <td>7</td>
      <td>6</td>
      <td>70.80</td>
      <td>7.330000e+01</td>
      <td>76.3675</td>
      <td>83.685</td>
      <td>82.648333</td>
      <td>90.5450</td>
      <td>90.960000</td>
      <td>90.96</td>
      <td>8.069036</td>
    </tr>
    <tr>
      <th>8</th>
      <td>201601</td>
      <td>8</td>
      <td>4</td>
      <td>8.30</td>
      <td>8.690000e+00</td>
      <td>9.2750</td>
      <td>9.805</td>
      <td>36.630000</td>
      <td>37.1600</td>
      <td>86.029992</td>
      <td>118.61</td>
      <td>47.335385</td>
    </tr>
    <tr>
      <th>9</th>
      <td>201601</td>
      <td>9</td>
      <td>1</td>
      <td>11.80</td>
      <td>1.180000e+01</td>
      <td>11.8000</td>
      <td>11.800</td>
      <td>11.800000</td>
      <td>11.8000</td>
      <td>11.800000</td>
      <td>11.80</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>10</th>
      <td>201602</td>
      <td>0</td>
      <td>137</td>
      <td>-10.10</td>
      <td>3.000000e-01</td>
      <td>6.3500</td>
      <td>13.390</td>
      <td>24.970073</td>
      <td>35.3000</td>
      <td>70.513999</td>
      <td>148.01</td>
      <td>30.159674</td>
    </tr>
    <tr>
      <th>11</th>
      <td>201602</td>
      <td>1</td>
      <td>1911279</td>
      <td>-150.30</td>
      <td>6.360000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.160333</td>
      <td>16.5500</td>
      <td>27.300000</td>
      <td>1297.75</td>
      <td>13.008159</td>
    </tr>
    <tr>
      <th>12</th>
      <td>201602</td>
      <td>2</td>
      <td>383117</td>
      <td>-200.80</td>
      <td>6.800000e+00</td>
      <td>8.3000</td>
      <td>11.750</td>
      <td>15.868765</td>
      <td>17.1600</td>
      <td>29.300000</td>
      <td>1154.84</td>
      <td>14.086363</td>
    </tr>
    <tr>
      <th>13</th>
      <td>201602</td>
      <td>3</td>
      <td>107589</td>
      <td>-52.80</td>
      <td>6.800000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.317193</td>
      <td>16.8000</td>
      <td>27.300000</td>
      <td>472.94</td>
      <td>12.881864</td>
    </tr>
    <tr>
      <th>14</th>
      <td>201602</td>
      <td>4</td>
      <td>50919</td>
      <td>-958.40</td>
      <td>6.800000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.412864</td>
      <td>16.8000</td>
      <td>27.950000</td>
      <td>958.40</td>
      <td>14.208739</td>
    </tr>
    <tr>
      <th>15</th>
      <td>201602</td>
      <td>5</td>
      <td>147897</td>
      <td>-54.80</td>
      <td>6.360000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.380488</td>
      <td>16.8000</td>
      <td>28.340000</td>
      <td>240.80</td>
      <td>12.517914</td>
    </tr>
    <tr>
      <th>16</th>
      <td>201602</td>
      <td>6</td>
      <td>91826</td>
      <td>-52.80</td>
      <td>6.360000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>15.058432</td>
      <td>16.5600</td>
      <td>27.300000</td>
      <td>200.00</td>
      <td>12.108098</td>
    </tr>
    <tr>
      <th>17</th>
      <td>201602</td>
      <td>7</td>
      <td>2</td>
      <td>8.10</td>
      <td>8.365000e+00</td>
      <td>8.7625</td>
      <td>9.425</td>
      <td>9.425000</td>
      <td>10.0875</td>
      <td>10.485000</td>
      <td>10.75</td>
      <td>1.325000</td>
    </tr>
    <tr>
      <th>18</th>
      <td>201602</td>
      <td>8</td>
      <td>6</td>
      <td>5.80</td>
      <td>7.050000e+00</td>
      <td>8.7250</td>
      <td>10.100</td>
      <td>36.156667</td>
      <td>63.1500</td>
      <td>91.319997</td>
      <td>101.84</td>
      <td>39.502676</td>
    </tr>
    <tr>
      <th>19</th>
      <td>201602</td>
      <td>9</td>
      <td>6</td>
      <td>-9.60</td>
      <td>1.430511e-07</td>
      <td>9.7250</td>
      <td>11.360</td>
      <td>36.283333</td>
      <td>57.2825</td>
      <td>97.489994</td>
      <td>122.81</td>
      <td>46.255662</td>
    </tr>
    <tr>
      <th>20</th>
      <td>201603</td>
      <td>0</td>
      <td>110</td>
      <td>0.00</td>
      <td>3.000000e-01</td>
      <td>0.9275</td>
      <td>11.460</td>
      <td>30.601818</td>
      <td>53.1750</td>
      <td>90.259985</td>
      <td>282.30</td>
      <td>42.165426</td>
    </tr>
    <tr>
      <th>21</th>
      <td>201603</td>
      <td>1</td>
      <td>1526446</td>
      <td>-200.80</td>
      <td>6.800000e+00</td>
      <td>8.5000</td>
      <td>11.760</td>
      <td>15.951602</td>
      <td>17.3000</td>
      <td>29.000000</td>
      <td>8008.80</td>
      <td>16.090206</td>
    </tr>
    <tr>
      <th>22</th>
      <td>201603</td>
      <td>2</td>
      <td>281137</td>
      <td>-75.30</td>
      <td>6.800000e+00</td>
      <td>8.7600</td>
      <td>12.250</td>
      <td>16.938134</td>
      <td>18.3000</td>
      <td>32.800000</td>
      <td>725.30</td>
      <td>15.298718</td>
    </tr>
    <tr>
      <th>23</th>
      <td>201603</td>
      <td>3</td>
      <td>76414</td>
      <td>-75.84</td>
      <td>6.800000e+00</td>
      <td>8.7600</td>
      <td>11.800</td>
      <td>16.356485</td>
      <td>17.7600</td>
      <td>29.800000</td>
      <td>1137.85</td>
      <td>15.731051</td>
    </tr>
    <tr>
      <th>24</th>
      <td>201603</td>
      <td>4</td>
      <td>35166</td>
      <td>-73.80</td>
      <td>6.800000e+00</td>
      <td>8.7600</td>
      <td>11.800</td>
      <td>16.261706</td>
      <td>17.7600</td>
      <td>30.800000</td>
      <td>459.79</td>
      <td>14.083521</td>
    </tr>
    <tr>
      <th>25</th>
      <td>201603</td>
      <td>5</td>
      <td>117191</td>
      <td>-52.80</td>
      <td>6.800000e+00</td>
      <td>8.7600</td>
      <td>11.800</td>
      <td>16.123766</td>
      <td>17.7600</td>
      <td>30.300000</td>
      <td>271.30</td>
      <td>13.284821</td>
    </tr>
    <tr>
      <th>26</th>
      <td>201603</td>
      <td>6</td>
      <td>70617</td>
      <td>-52.80</td>
      <td>6.800000e+00</td>
      <td>8.5000</td>
      <td>11.760</td>
      <td>15.869602</td>
      <td>17.3000</td>
      <td>29.300000</td>
      <td>326.84</td>
      <td>12.932498</td>
    </tr>
    <tr>
      <th>27</th>
      <td>201603</td>
      <td>7</td>
      <td>5</td>
      <td>7.60</td>
      <td>7.788000e+00</td>
      <td>8.0700</td>
      <td>8.100</td>
      <td>29.332000</td>
      <td>46.5900</td>
      <td>64.415997</td>
      <td>76.30</td>
      <td>27.853121</td>
    </tr>
    <tr>
      <th>28</th>
      <td>201603</td>
      <td>8</td>
      <td>5</td>
      <td>8.80</td>
      <td>9.120000e+00</td>
      <td>9.6000</td>
      <td>80.800</td>
      <td>58.760000</td>
      <td>95.3000</td>
      <td>97.700000</td>
      <td>99.30</td>
      <td>40.931973</td>
    </tr>
    <tr>
      <th>29</th>
      <td>201603</td>
      <td>9</td>
      <td>3</td>
      <td>10.10</td>
      <td>1.164000e+01</td>
      <td>13.9500</td>
      <td>17.800</td>
      <td>42.233333</td>
      <td>58.3000</td>
      <td>82.599996</td>
      <td>98.80</td>
      <td>40.122008</td>
    </tr>
    <tr>
      <th>30</th>
      <td>201604</td>
      <td>0</td>
      <td>80</td>
      <td>-0.80</td>
      <td>3.000000e-01</td>
      <td>1.1750</td>
      <td>17.945</td>
      <td>33.452375</td>
      <td>62.7625</td>
      <td>80.300000</td>
      <td>132.80</td>
      <td>33.498167</td>
    </tr>
    <tr>
      <th>31</th>
      <td>201604</td>
      <td>1</td>
      <td>1622846</td>
      <td>-440.34</td>
      <td>6.800000e+00</td>
      <td>8.7600</td>
      <td>12.300</td>
      <td>16.211807</td>
      <td>18.3000</td>
      <td>29.160000</td>
      <td>111271.65</td>
      <td>88.344714</td>
    </tr>
    <tr>
      <th>32</th>
      <td>201604</td>
      <td>2</td>
      <td>323779</td>
      <td>-234.80</td>
      <td>6.950000e+00</td>
      <td>8.8000</td>
      <td>12.360</td>
      <td>16.718532</td>
      <td>18.8000</td>
      <td>30.950000</td>
      <td>795.84</td>
      <td>13.931410</td>
    </tr>
    <tr>
      <th>33</th>
      <td>201604</td>
      <td>3</td>
      <td>89060</td>
      <td>-52.80</td>
      <td>6.850000e+00</td>
      <td>8.8000</td>
      <td>12.300</td>
      <td>16.218767</td>
      <td>18.3000</td>
      <td>29.160000</td>
      <td>724.82</td>
      <td>13.392155</td>
    </tr>
    <tr>
      <th>34</th>
      <td>201604</td>
      <td>4</td>
      <td>41461</td>
      <td>-52.80</td>
      <td>6.890000e+00</td>
      <td>8.8000</td>
      <td>12.300</td>
      <td>16.079813</td>
      <td>18.3000</td>
      <td>28.800000</td>
      <td>249.35</td>
      <td>12.625694</td>
    </tr>
    <tr>
      <th>35</th>
      <td>201604</td>
      <td>5</td>
      <td>126134</td>
      <td>-52.80</td>
      <td>6.800000e+00</td>
      <td>8.8000</td>
      <td>12.300</td>
      <td>16.341509</td>
      <td>18.3600</td>
      <td>30.290000</td>
      <td>259.80</td>
      <td>12.791541</td>
    </tr>
    <tr>
      <th>36</th>
      <td>201604</td>
      <td>6</td>
      <td>77699</td>
      <td>-52.80</td>
      <td>6.800000e+00</td>
      <td>8.8000</td>
      <td>12.300</td>
      <td>16.129398</td>
      <td>18.3000</td>
      <td>29.750000</td>
      <td>177.46</td>
      <td>12.564739</td>
    </tr>
    <tr>
      <th>37</th>
      <td>201604</td>
      <td>7</td>
      <td>5</td>
      <td>8.10</td>
      <td>9.460000e+00</td>
      <td>11.5000</td>
      <td>18.170</td>
      <td>37.074000</td>
      <td>70.0000</td>
      <td>74.559999</td>
      <td>77.60</td>
      <td>30.256773</td>
    </tr>
    <tr>
      <th>38</th>
      <td>201604</td>
      <td>8</td>
      <td>5</td>
      <td>10.38</td>
      <td>1.046800e+01</td>
      <td>10.6000</td>
      <td>80.800</td>
      <td>60.596000</td>
      <td>98.8400</td>
      <td>100.952000</td>
      <td>102.36</td>
      <td>41.560278</td>
    </tr>
    <tr>
      <th>39</th>
      <td>201604</td>
      <td>9</td>
      <td>5</td>
      <td>10.80</td>
      <td>4.360000e+01</td>
      <td>92.8000</td>
      <td>97.800</td>
      <td>82.100000</td>
      <td>100.3000</td>
      <td>105.399999</td>
      <td>108.80</td>
      <td>36.024436</td>
    </tr>
    <tr>
      <th>40</th>
      <td>201653</td>
      <td>0</td>
      <td>64</td>
      <td>-7.80</td>
      <td>3.000000e-01</td>
      <td>1.1425</td>
      <td>11.775</td>
      <td>24.791719</td>
      <td>34.7250</td>
      <td>73.869993</td>
      <td>107.30</td>
      <td>29.413893</td>
    </tr>
    <tr>
      <th>41</th>
      <td>201653</td>
      <td>1</td>
      <td>852098</td>
      <td>-300.80</td>
      <td>6.300000e+00</td>
      <td>7.8000</td>
      <td>10.800</td>
      <td>15.229454</td>
      <td>16.5600</td>
      <td>29.120000</td>
      <td>1003.38</td>
      <td>13.651999</td>
    </tr>
    <tr>
      <th>42</th>
      <td>201653</td>
      <td>2</td>
      <td>212052</td>
      <td>-258.20</td>
      <td>6.360000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>16.580428</td>
      <td>17.7600</td>
      <td>34.240000</td>
      <td>1004.94</td>
      <td>15.547422</td>
    </tr>
    <tr>
      <th>43</th>
      <td>201653</td>
      <td>3</td>
      <td>63032</td>
      <td>-75.30</td>
      <td>6.360000e+00</td>
      <td>8.3000</td>
      <td>11.300</td>
      <td>16.141369</td>
      <td>17.3000</td>
      <td>31.340000</td>
      <td>998.30</td>
      <td>15.105769</td>
    </tr>
    <tr>
      <th>44</th>
      <td>201653</td>
      <td>4</td>
      <td>35412</td>
      <td>-100.30</td>
      <td>6.800000e+00</td>
      <td>8.3000</td>
      <td>11.400</td>
      <td>16.463965</td>
      <td>17.3000</td>
      <td>32.195966</td>
      <td>656.15</td>
      <td>15.957624</td>
    </tr>
    <tr>
      <th>45</th>
      <td>201653</td>
      <td>5</td>
      <td>71221</td>
      <td>-21.30</td>
      <td>6.300000e+00</td>
      <td>8.1600</td>
      <td>11.160</td>
      <td>15.816108</td>
      <td>17.1600</td>
      <td>32.300000</td>
      <td>469.30</td>
      <td>13.725301</td>
    </tr>
    <tr>
      <th>46</th>
      <td>201653</td>
      <td>6</td>
      <td>43020</td>
      <td>-52.80</td>
      <td>6.300000e+00</td>
      <td>7.8800</td>
      <td>11.000</td>
      <td>15.358045</td>
      <td>16.6400</td>
      <td>30.300000</td>
      <td>148.34</td>
      <td>13.060431</td>
    </tr>
    <tr>
      <th>47</th>
      <td>201653</td>
      <td>7</td>
      <td>4</td>
      <td>8.20</td>
      <td>8.665000e+00</td>
      <td>9.3625</td>
      <td>40.025</td>
      <td>45.147500</td>
      <td>75.8100</td>
      <td>85.727998</td>
      <td>92.34</td>
      <td>37.006354</td>
    </tr>
    <tr>
      <th>48</th>
      <td>201653</td>
      <td>8</td>
      <td>6</td>
      <td>9.60</td>
      <td>4.495000e+01</td>
      <td>80.4250</td>
      <td>80.800</td>
      <td>77.088333</td>
      <td>84.5800</td>
      <td>105.514995</td>
      <td>125.19</td>
      <td>34.114769</td>
    </tr>
    <tr>
      <th>49</th>
      <td>201653</td>
      <td>9</td>
      <td>8</td>
      <td>5.80</td>
      <td>7.025000e+00</td>
      <td>7.7375</td>
      <td>8.400</td>
      <td>10.331250</td>
      <td>12.0125</td>
      <td>15.004999</td>
      <td>20.15</td>
      <td>4.291994</td>
    </tr>
  </tbody>
</table>
</div>

<br>

```python
pivoted_df = pd.pivot_table(aggregated_df,
               values=['_50th_percentile'],
               index=['yyyyww'],
               columns=['passenger_count'],
               aggfunc='max'
            )
pivoted_df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="10" halign="left">_50th_percentile</th>
    </tr>
    <tr>
      <th>passenger_count</th>
      <th>0</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
      <th>5</th>
      <th>6</th>
      <th>7</th>
      <th>8</th>
      <th>9</th>
    </tr>
    <tr>
      <th>yyyyww</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>201601</th>
      <td>10.560</td>
      <td>11.16</td>
      <td>11.62</td>
      <td>11.3</td>
      <td>11.3</td>
      <td>11.30</td>
      <td>11.16</td>
      <td>83.685</td>
      <td>9.805</td>
      <td>11.80</td>
    </tr>
    <tr>
      <th>201602</th>
      <td>13.390</td>
      <td>11.30</td>
      <td>11.75</td>
      <td>11.3</td>
      <td>11.3</td>
      <td>11.30</td>
      <td>11.30</td>
      <td>9.425</td>
      <td>10.100</td>
      <td>11.36</td>
    </tr>
    <tr>
      <th>201603</th>
      <td>11.460</td>
      <td>11.76</td>
      <td>12.25</td>
      <td>11.8</td>
      <td>11.8</td>
      <td>11.80</td>
      <td>11.76</td>
      <td>8.100</td>
      <td>80.800</td>
      <td>17.80</td>
    </tr>
    <tr>
      <th>201604</th>
      <td>17.945</td>
      <td>12.30</td>
      <td>12.36</td>
      <td>12.3</td>
      <td>12.3</td>
      <td>12.30</td>
      <td>12.30</td>
      <td>18.170</td>
      <td>80.800</td>
      <td>97.80</td>
    </tr>
    <tr>
      <th>201653</th>
      <td>11.775</td>
      <td>10.80</td>
      <td>11.30</td>
      <td>11.3</td>
      <td>11.4</td>
      <td>11.16</td>
      <td>11.00</td>
      <td>40.025</td>
      <td>80.800</td>
      <td>8.40</td>
    </tr>
  </tbody>
</table>
</div>



### Let's summarize what we have accomplished! 
To go from Python to SQL, we have used Python to generate SQL dynamically and have embedded our SQL code nicely alongside Python in our Jupyter Notebook programming environment. We also discussed using DuckDB to read a Pandas DF directly. When moving from SQL to Python, DuckDB can quickly and easily convert SQL results back into Pandas DF's. **Now we can mix and match Python and SQL to our heart's content!**

Thank you for reading! Please hop on [Twitter](https://twitter.com/__alexmonahan__?lang=en) and let me know if any of this was helpful or what I can cover next!
