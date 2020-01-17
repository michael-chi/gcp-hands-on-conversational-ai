import pyodbc 
# import apache_beam as beam
# from apache_beam.options.pipeline_options import PipelineOptions
def retrieve_data2(details, tsql):
    connect_string = 'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};PORT=1443; DATABASE={database};UID={username};PWD={password}'.format(**details)
    connection = pyodbc.connect(connect_string)
    #grab a new cursor object from the connection
    cursor = connection.cursor()
    table = cursor.execute(tsql)

    columns = [column[0] for column in table.description]
    results = []
    for row in table.fetchall()::
        results.append(dict(zip(columns, row)))
    return results

def retrieve_data(details, tsql):
    """
    details = {
        'server' : 'xxx.database.windows.net',
        'database' : 'xxx',
        'username' : 'xxx',
        'password' : 'xxx'
    }
    """
    connect_string = 'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};PORT=1443; DATABASE={database};UID={username};PWD={password}'.format(**details)
    connection = pyodbc.connect(connect_string)
    #grab a new cursor object from the connection
    cursor = connection.cursor()
    cursor.execute(tsql)
    tables = cursor.fetchall()
    
    for row in tables:
        print row

if __name__ == "__main__":
    details = {
        'server' : 'xxx.database.windows.net',
        'database' : 'xxx',
        'username' : 'xxx',
        'password' : 'xxx'
    }
    result = retrieve_data2(details, "select * from SalesLT.Customer")
    # retrieve_data(details, "SELECT client_net_address FROM sys.dm_exec_connections WHERE Session_id = @@SPID;")
