browse_view = '''CREATE OR REPLACE VIEW BrowseView AS
SELECT 
	Filter.FilterID, 
  Filter.FilterName, 
  UserFilter.UserName AS UserName, 
  F2.FilterID AS ForkedFrom,
  IFNULL(TableF.ForkCount, 0) AS ForkCount,
  IFNULL(TableSave.SaveCount, 0) AS SaveCount,
  IFNULL(TableLike.LikeCount, 0) AS LikeCount
FROM Filter
JOIN UserFilter 
	ON Filter.FilterID = UserFilter.FilterID
LEFT JOIN ClonedFrom 
	ON ClonedFrom.FilterID = Filter.FilterID
LEFT JOIN Filter F2 
	ON ClonedFrom.ClonedFromFilterID = F2.FilterID
LEFT JOIN (
	SELECT 
		F3.FilterID AS fd, 
    Count(F3.FilterID) as ForkCount
	FROM Filter F3 
    JOIN ClonedFrom cf 
		ON F3.FilterID = cf.ClonedFromFilterID 
	GROUP BY fd
  ) AS TableF 
  ON TableF.fd = Filter.FilterID
LEFT JOIN (
	SELECT 
		F4.FilterID AS fd, 
    Count(F4.FilterID) as SaveCount
	FROM Filter F4
	JOIN UserSavedFilter UFD
		ON F4.FilterID = UFD.FilterID 
	GROUP BY fd
  ) AS TableSave
  ON TableSave.fd = Filter.FilterID
LEFT JOIN (
	SELECT 
		F5.FilterID AS fd, 
    Count(F5.FilterID) as LikeCount
	FROM Filter F5
	JOIN UserLikedFilter ULD
		ON F5.FilterID = ULD.FilterID 
	GROUP BY fd
  ) AS TableLike
  ON TableLike.fd = Filter.FilterID
'''

browse_top_view = '''CREATE OR REPLACE VIEW BrowseTopView AS
SELECT 
  Filter.FilterID, 
  IFNULL(TableLike.LikeCount, 0) AS LikeCount
FROM Filter
LEFT JOIN (
  SELECT 
    F5.FilterID AS fd, 
    Count(F5.FilterID) as LikeCount
  FROM Filter F5
  JOIN UserLikedFilter ULD
    ON F5.FilterID = ULD.FilterID 
  GROUP BY fd
  ) AS TableLike
  ON TableLike.fd = Filter.FilterID
ORDER BY LikeCount DESC LIMIT 4
'''

def create_views(cursor):
  cursor.execute('''CREATE OR REPLACE 
  VIEW FilterView AS 
  SELECT f.FilterID, f.FilterName, f.Description, f.InitialOrientation, f.InputImagePath, f.OutputImagePath, uv.CreatedOn, uv.UserName, fc.Code, fc.Variables 
  FROM Filter f 
  JOIN FilterCode fc ON f.FilterID = fc.FilterID
  JOIN UserFilter uv ON f.FilterID = uv.FilterID;''')
  cursor.execute('''CREATE OR REPLACE
  VIEW UserFilterView AS
  SELECT f.FilterID, f.FilterName, uv.CreatedOn, uv.UserName
  FROM Filter f
  JOIN UserFilter uv ON f.FilterID = uv.FilterID;''')
  cursor.execute(browse_view)
  cursor.execute(browse_top_view)

def views_metadata(cursor):
  views= ["FilterView"]
  for view in views:
    cursor.execute(f"SHOW CREATE VIEW {view}")
    print(cursor.fetchone()[1])