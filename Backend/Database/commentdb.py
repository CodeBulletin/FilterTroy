def getComments(cursor, filter_id):
    cursor.execute("SELECT CommentID, Comment, UserName, CreatedOn, ProfilePicPath FROM CommentView WHERE FilterID = %s", (filter_id,))
    return cursor.fetchall()

def addComment(connection, comment, filter_id, username):
    cursor = connection.cursor()
    cursor.execute("INSERT INTO Comment (Comment, FilterID) VALUES (%s, %s)", (comment, filter_id))
    cursor.execute("SELECT LAST_INSERT_ID()")
    comment_id = cursor.fetchone()[0]
    cursor.execute("INSERT INTO UserComment (UserName, CommentID) VALUES (%s, %s)", (username, comment_id))
    cursor.close()
    connection.commit()

def getReplies(cursor, comment_id):
    cursor.execute("SELECT ReplyID, Reply, UserName, CreatedOn, ProfilePicPath FROM ReplyView WHERE CommentID = %s", (comment_id,))
    return cursor.fetchall()

def addReply(connection, reply, comment_id, username):
    cursor = connection.cursor()
    cursor.execute("INSERT INTO Reply (Reply, CommentID) VALUES (%s, %s)", (reply, comment_id))
    cursor.execute("SELECT LAST_INSERT_ID()")
    reply_id = cursor.fetchone()[0]
    cursor.execute("INSERT INTO UserReply (UserName, ReplyID) VALUES (%s, %s)", (username, reply_id))
    cursor.close()
    connection.commit()