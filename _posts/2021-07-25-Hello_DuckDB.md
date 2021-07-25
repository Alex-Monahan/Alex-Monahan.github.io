
# Title



![image.png](Hello DuckDB_files\att_00000.png)
# Python and SQL - Better Together with DuckDB!

#### Many recent articles have compared SQL to more typical imperative languages. However, in my experience, I have needed both! I believe the more productive discussion is around deciding when to use each, and how to seamlessly blend them together. SQL isn't going anywhere, and neither are imperative languages!

#### DuckDB is an in process database like SQLite, but with far more speed when processing analytical queries. It works very nicely with Python's Pandas as well, and also shares much of its syntax with industry-standard PostgreSQL (while rounding out a few rough edges with some inspiration from SQLite, Clickhouse, and others!). I believe DuckDB can bridge the gap between Python and SQL, so let's look at some best practices to do this well!

```python
# !pip install duckdb
import pandas as pd
import numpy as np
import duckdb
```

    Collecting duckdb
      Downloading https://files.pythonhosted.org/packages/36/9c/9f64f1523a6f054e9ea6aac033916fb3b3f3199c84cd1d8991d41893e6ab/duckdb-0.2.7-cp37-cp37m-win_amd64.whl (6.3MB)
    Requirement already satisfied: numpy>=1.14 in c:\programdata\anaconda3\lib\site-packages (from duckdb) (1.15.4)
    Installing collected packages: duckdb
    Successfully installed duckdb-0.2.7
    

```python
duckdb_conn = duckdb.connect(':memory:')
```

```python
duckdb_conn.execute("CREATE TABLE train AS SELECT * from read_csv_auto('C:\\Users\\Alex\\Documents\\Python Scripts\\nyc-taxi-trip-duration\\train\\train.csv')").fetchdf()

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
      <td>1458644</td>
    </tr>
  </tbody>
</table>
</div>



```python
duckdb_conn.execute('SELECT * FROM train limit 10').fetchdf()
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
      <th>id</th>
      <th>vendor_id</th>
      <th>pickup_datetime</th>
      <th>dropoff_datetime</th>
      <th>passenger_count</th>
      <th>pickup_longitude</th>
      <th>pickup_latitude</th>
      <th>dropoff_longitude</th>
      <th>dropoff_latitude</th>
      <th>store_and_fwd_flag</th>
      <th>trip_duration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>id2875421</td>
      <td>2</td>
      <td>2016-03-14 17:24:55</td>
      <td>2016-03-14 17:32:30</td>
      <td>1</td>
      <td>-73.982155</td>
      <td>40.767937</td>
      <td>-73.964630</td>
      <td>40.765602</td>
      <td>N</td>
      <td>455</td>
    </tr>
    <tr>
      <th>1</th>
      <td>id2377394</td>
      <td>1</td>
      <td>2016-06-12 00:43:35</td>
      <td>2016-06-12 00:54:38</td>
      <td>1</td>
      <td>-73.980415</td>
      <td>40.738564</td>
      <td>-73.999481</td>
      <td>40.731152</td>
      <td>N</td>
      <td>663</td>
    </tr>
    <tr>
      <th>2</th>
      <td>id3858529</td>
      <td>2</td>
      <td>2016-01-19 11:35:24</td>
      <td>2016-01-19 12:10:48</td>
      <td>1</td>
      <td>-73.979027</td>
      <td>40.763939</td>
      <td>-74.005333</td>
      <td>40.710087</td>
      <td>N</td>
      <td>2124</td>
    </tr>
    <tr>
      <th>3</th>
      <td>id3504673</td>
      <td>2</td>
      <td>2016-04-06 19:32:31</td>
      <td>2016-04-06 19:39:40</td>
      <td>1</td>
      <td>-74.010040</td>
      <td>40.719971</td>
      <td>-74.012268</td>
      <td>40.706718</td>
      <td>N</td>
      <td>429</td>
    </tr>
    <tr>
      <th>4</th>
      <td>id2181028</td>
      <td>2</td>
      <td>2016-03-26 13:30:55</td>
      <td>2016-03-26 13:38:10</td>
      <td>1</td>
      <td>-73.973053</td>
      <td>40.793209</td>
      <td>-73.972923</td>
      <td>40.782520</td>
      <td>N</td>
      <td>435</td>
    </tr>
    <tr>
      <th>5</th>
      <td>id0801584</td>
      <td>2</td>
      <td>2016-01-30 22:01:40</td>
      <td>2016-01-30 22:09:03</td>
      <td>6</td>
      <td>-73.982857</td>
      <td>40.742195</td>
      <td>-73.992081</td>
      <td>40.749184</td>
      <td>N</td>
      <td>443</td>
    </tr>
    <tr>
      <th>6</th>
      <td>id1813257</td>
      <td>1</td>
      <td>2016-06-17 22:34:59</td>
      <td>2016-06-17 22:40:40</td>
      <td>4</td>
      <td>-73.969017</td>
      <td>40.757839</td>
      <td>-73.957405</td>
      <td>40.765896</td>
      <td>N</td>
      <td>341</td>
    </tr>
    <tr>
      <th>7</th>
      <td>id1324603</td>
      <td>2</td>
      <td>2016-05-21 07:54:58</td>
      <td>2016-05-21 08:20:49</td>
      <td>1</td>
      <td>-73.969276</td>
      <td>40.797779</td>
      <td>-73.922470</td>
      <td>40.760559</td>
      <td>N</td>
      <td>1551</td>
    </tr>
    <tr>
      <th>8</th>
      <td>id1301050</td>
      <td>1</td>
      <td>2016-05-27 23:12:23</td>
      <td>2016-05-27 23:16:38</td>
      <td>1</td>
      <td>-73.999481</td>
      <td>40.738400</td>
      <td>-73.985786</td>
      <td>40.732815</td>
      <td>N</td>
      <td>255</td>
    </tr>
    <tr>
      <th>9</th>
      <td>id0012891</td>
      <td>2</td>
      <td>2016-03-10 21:45:01</td>
      <td>2016-03-10 22:05:26</td>
      <td>1</td>
      <td>-73.981049</td>
      <td>40.744339</td>
      <td>-73.973000</td>
      <td>40.789989</td>
      <td>N</td>
      <td>1225</td>
    </tr>
  </tbody>
</table>
</div>


