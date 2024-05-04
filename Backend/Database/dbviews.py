def create_views(cursor):
  cursor.execute('''CREATE OR REPLACE 
  VIEW FilterView AS 
  SELECT f.FilterID, f.FilterName, f.Description, f.InitialOrientation, f.InputImagePath, f.OutputImagePath, uv.CreatedOn, uv.UserName, fc.Code, fc.Variables 
  FROM Filter f 
  JOIN FilterCode fc ON f.FilterID = fc.FilterID
  JOIN UserFilter uv ON f.FilterID = uv.FilterID;''')

def views_metadata(cursor):
  views= ["FilterView"]
  for view in views:
    cursor.execute(f"SHOW CREATE VIEW {view}")
    print(cursor.fetchone()[1])