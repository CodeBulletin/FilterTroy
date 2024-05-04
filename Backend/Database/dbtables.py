def create_tables(cursor):
    cursor.execute('''CREATE TABLE IF NOT EXISTS Users (
    UserName VARCHAR(50) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Disabled BOOLEAN NOT NULL DEFAULT false,
    Hashed_Password VARCHAR(100) NOT NULL,
    ProfilePicPath VARCHAR(255),
    CreatedOn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserName)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS Filter (
    FilterID INT AUTO_INCREMENT NOT NULL,
    FilterName VARCHAR(50) NOT NULL,
    Description VARCHAR(500) NOT NULL,
    InitialOrientation INT NOT NULL,
    InputImagePath VARCHAR(255) NOT NULL,
    OutputImagePath VARCHAR(255) NOT NULL,
    PRIMARY KEY (FilterID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS UserFilter (
    UserName VARCHAR(255) NOT NULL,
    FilterID INT NOT NULL,
    CreatedOn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserName, FilterID),
    FOREIGN KEY (UserName) REFERENCES Users(UserName),
    FOREIGN KEY (FilterID) REFERENCES Filter(FilterID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS FilterCode (
    FilterID INT NOT NULL,
    Code LONGTEXT,
    Variables JSON,
    PRIMARY KEY (FilterID),
    FOREIGN KEY (FilterID) REFERENCES Filter(FilterID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS UserLikedFilter (
    UserName VARCHAR(50) NOT NULL,
    FilterID INT NOT NULL,
    LikedOn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserName, FilterID),
    FOREIGN KEY (UserName) REFERENCES Users(UserName),
    FOREIGN KEY (FilterID) REFERENCES Filter(FilterID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS UserSavedFilter (
    UserName VARCHAR(50) NOT NULL,
    FilterID INT NOT NULL,
    SavedOn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserName, FilterID),
    FOREIGN KEY (UserName) REFERENCES Users(UserName),
    FOREIGN KEY (FilterID) REFERENCES Filter(FilterID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS Comment (
    CommentID INT AUTO_INCREMENT PRIMARY KEY,
    CreatedOn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Comment VARCHAR(500) NOT NULL,
    FilterID INT NOT NULL,
    FOREIGN KEY (FilterID) REFERENCES Filter(FilterID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS UserComment (
    UserName VARCHAR(50) NOT NULL,
    CommentID INT NOT NULL,
    PRIMARY KEY (UserName, CommentID),
    FOREIGN KEY (UserName) REFERENCES Users(UserName),
    FOREIGN KEY (CommentID) REFERENCES Comment(CommentID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS Reply (
    ReplyID INT AUTO_INCREMENT PRIMARY KEY,
    CreatedOn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Reply VARCHAR(250) NOT NULL,
    CommentID INT NOT NULL,
    FOREIGN KEY (CommentID) REFERENCES Comment(CommentID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS UserReply (
    UserName VARCHAR(50) NOT NULL,
    ReplyID INT NOT NULL,
    PRIMARY KEY (UserName, ReplyID),
    FOREIGN KEY (UserName) REFERENCES Users(UserName),
    FOREIGN KEY (ReplyID) REFERENCES Reply(ReplyID)
);''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS ClonedFrom (
    FilterID INT NOT NULL,
    ClonedFromFilterID INT NOT NULL,
    PRIMARY KEY (FilterID, ClonedFromFilterID),
    FOREIGN KEY (FilterID) REFERENCES Filter(FilterID),
    FOREIGN KEY (ClonedFromFilterID) REFERENCES Filter(FilterID)
);''')

def tables_metadata(cursor):
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("Tables:", tables)
    for table in tables:
        cursor.execute(f"DESCRIBE {table[0]}")
        print(f"Table: {table[0]}:{cursor.fetchall()}")