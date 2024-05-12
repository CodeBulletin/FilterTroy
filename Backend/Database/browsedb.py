def getFilters(cursor, filters):
    print(filters)
    if filters.id != "":
        cursor.execute(f"SELECT FilterID FROM Filter WHERE FilterID = %s", (filters.id,))
        return cursor.fetchall()
    
    where_query = ""

    if filters.nameLike != "":
        escape_underscore = filters.nameLike.replace("_", "\\_")
        escape_percent = escape_underscore.replace("%", "\\%")
        where_query += f"FilterName LIKE '%{escape_percent}%'"

    if filters.byUser != "":
        if where_query != "":
            where_query += " AND "
        escape_underscore = filters.byUser.replace("_", "\\_")
        escape_percent = escape_underscore.replace("%", "\\%")
        where_query += f"UserName LIKE '%{escape_percent}%'"
    
    if filters.forkedFrom != "":
        if where_query != "":
            where_query += " AND "
        where_query += f"ForkedFrom = '{filters.forkedFrom}'"

    if where_query != "":
        where_query = f"WHERE {where_query}"

    sort_query = ""
    if filters.sortBy != "":
        sort_query += f"ORDER BY {filters.sortBy} {filters.sortOrder}"

    if where_query != "" or sort_query != "":
        query = f"SELECT FilterID FROM BrowseView {where_query} {sort_query};"
        print(query)
        cursor.execute(query)
    else:
        cursor.execute("SELECT FilterID FROM Filter")

    return cursor.fetchall()

def getSavedFilters(cursor, userID):
    cursor.execute("SELECT FilterID FROM UserSavedFilter WHERE UserName = %s", (userID,))
    return cursor.fetchall()

def getMyFilters(cursor, userID):
    cursor.execute("SELECT FilterID FROM UserFilter WHERE UserName = %s", (userID,))
    return cursor.fetchall()

def getTopLiked(cursor):
    cursor.execute("SELECT FilterID FROM BrowseTopView")
    return cursor.fetchall()