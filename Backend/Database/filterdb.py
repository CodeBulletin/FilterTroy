from utils import generateID
from Models.filter import FilterFromDB
from datetime import datetime

def create_filter(data, connection, id=None):
    cursor = connection.cursor()
    id = generateID(7) if id is None else id
    cursor.execute(
        '''INSERT INTO Filter 
        (FilterID, FilterName, Description, InitialOrientation, InputImagePath, OutputImagePath) 
        VALUES (%s, %s, %s, %s, %s, %s)''', 
        (
            id, 
            data["filter_name"], 
            data["filter_desc"], 
            data["initial_orientation"], 
            data["image_input"], 
            data["image_output"]
        )
    )
    cursor.execute("INSERT INTO FilterCode (FilterID, Code, Variables) VALUES (%s, %s, %s)", (id, data["code"], data["variables"]))
    cursor.execute("INSERT INTO UserFilter (UserName, FilterID) VALUES (%s, %s)", (data["username"], id))
    connection.commit()
    cursor.close()
    return id


def doesFilterExist(connection, filter_name, username):
    cursor = connection.cursor(buffered=True)
    cursor.execute("SELECT * FROM UserFilterView WHERE FilterName = %s AND UserName = %s", (filter_name, username))
    res = cursor.fetchone()
    cursor.close()
    return res is not None

def get_filter_by_id(connection, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM FilterView WHERE FilterID = %s", (filter_id,))
    res = cursor.fetchone()
    if res is None:
        cursor.close()
        return None
    cursor.close()

    filter = FilterFromDB(
        filter_id=res[0],
        filter_name=res[1],
        filter_desc=res[2],
        initial_orientation=res[3],
        input_image_path=res[4],
        output_image_path=res[5],
        created_on=datetime.strftime(res[6], "%Y-%m-%d %H:%M:%S"),
        user_name=res[7],
        filter_code=res[8],
        filter_vars=res[9],
    )
    
    return filter

def get_likecount(connection, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM UserLikedFilter WHERE FilterID = %s", (filter_id,))
    res = cursor.fetchone()
    cursor.close()
    return res[0]

def get_savecount(connection, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM UserSavedFilter WHERE FilterID = %s", (filter_id,))
    res = cursor.fetchone()
    cursor.close()
    return res[0]

def get_forkcount(connection, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM ClonedFrom WHERE ClonedFromFilterID = %s", (filter_id,))
    res = cursor.fetchone()
    cursor.close()
    return res[0]

def isLiked(connection, username, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM UserLikedFilter WHERE UserName = %s AND FilterID = %s", (username, filter_id))
    res = cursor.fetchone()
    cursor.close()
    return res is not None

def isSaved(connection, username, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM UserSavedFilter WHERE UserName = %s AND FilterID = %s", (username, filter_id))
    res = cursor.fetchone()
    cursor.close()
    return res is not None

def togglelike_filter(connection, username, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM UserLikedFilter WHERE UserName = %s AND FilterID = %s", (username, filter_id))
    res = cursor.fetchone()
    if res is None:
        cursor.execute("INSERT INTO UserLikedFilter (UserName, FilterID) VALUES (%s, %s)", (username, filter_id))
        connection.commit()
        cursor.close()
        return True
    else:
        cursor.execute("DELETE FROM UserLikedFilter WHERE UserName = %s AND FilterID = %s", (username, filter_id))
        connection.commit()
        cursor.close()
        return False

def togglesave_filter(connection, username, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM UserSavedFilter WHERE UserName = %s AND FilterID = %s", (username, filter_id))
    res = cursor.fetchone()
    if res is None:
        cursor.execute("INSERT INTO UserSavedFilter (UserName, FilterID) VALUES (%s, %s)", (username, filter_id))
        connection.commit()
        cursor.close()
        return True
    else:
        cursor.execute("DELETE FROM UserSavedFilter WHERE UserName = %s AND FilterID = %s", (username, filter_id))
        connection.commit()
        cursor.close()
        return False
    
def fork_filter(connection, username, filter_id, new_filter_name, new_filter_id, new_input_image, new_output_image):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Filter WHERE FilterID = %s", (filter_id,))
    res = cursor.fetchone()
    if res is None:
        cursor.close()
        return False
    cursor.execute("SELECT * FROM FilterCode WHERE FilterID = %s", (filter_id,))
    code = cursor.fetchone()

    cursor.execute(
        '''INSERT INTO Filter 
        (FilterID, FilterName, Description, InitialOrientation, InputImagePath, OutputImagePath) 
        VALUES (%s, %s, %s, %s, %s, %s)''', 
        (
            new_filter_id, 
            new_filter_name, 
            res[2], 
            res[3], 
            new_input_image,
            new_output_image
        )
    )

    cursor.execute("INSERT INTO FilterCode (FilterID, Code, Variables) VALUES (%s, %s, %s)", (new_filter_id, code[1], code[2]))

    cursor.execute("INSERT INTO UserFilter (UserName, FilterID) VALUES (%s, %s)", (username, new_filter_id))

    cursor.execute("INSERT INTO ClonedFrom (ClonedFromFilterID, FilterID) VALUES (%s, %s)", (filter_id, new_filter_id))

    connection.commit()
    cursor.close()
    return True

def does_filter_exist(connection, filter_name, username):
    cursor = connection.cursor()
    # Select from UserFilterView filtername should be case insensitive
    cursor.execute("SELECT * FROM UserFilterView WHERE LOWER(FilterName) = LOWER(%s) AND UserName = %s", (filter_name, username))
    res = cursor.fetchone()
    cursor.close()
    return res is not None

def getImages(connection, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT InputImagePath, OutputImagePath FROM Filter WHERE FilterID = %s", (filter_id,))
    res = cursor.fetchone()
    cursor.close()
    return res

def getAllFilterIDs(connection):
    cursor = connection.cursor()
    cursor.execute("SELECT FilterID FROM Filter")
    res = cursor.fetchall()
    cursor.close()
    return [x[0] for x in res]

def doesFilterExistAtAll(connection, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Filter WHERE FilterID = %s", (filter_id,))
    res = cursor.fetchone()
    cursor.close()
    return res is not None

def edit_filter(data, connection):
    cursor = connection.cursor()
    print(data)
    cursor.execute("UPDATE Filter SET Description = %s, InitialOrientation = %s, InputImagePath = %s, OutputImagePath = %s WHERE FilterID = %s", (data["filter_desc"], data["initial_orientation"], data["image_input"], data["image_output"], data["filter_id"]))
    cursor.execute("UPDATE FilterCode SET Code = %s, Variables = %s WHERE FilterID = %s", (data["code"], data["variables"], data["filter_id"]))
    connection.commit()
    cursor.close()
    return data["filter_id"]

def is_owned_by(connection, username, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM UserFilter WHERE UserName = %s AND FilterID = %s", (username, filter_id))
    res = cursor.fetchone()
    cursor.close()
    return res is not None

def isForked(connection, filter_id):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM ClonedFrom WHERE FilterID = %s", (filter_id,))
    res = cursor.fetchone()
    #  get the fork name of the original filter
    res2 = [None]
    if res is not None:
        cursor.execute("SELECT FilterName FROM Filter WHERE FilterID = %s", (res[1],))
        res2 = cursor.fetchone()
    cursor.close()
    #  return none if not forked else return the filter id of the original filter
    id = res[1] if res is not None else None
    name = res2[0] if res2 is not None else None
    return id, name