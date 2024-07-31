CREATE TABLE IF NOT EXISTS Users (
    userId VARCHAR(200) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Clothes (
    clothId INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    imgSrc TEXT NOT NULL,
    season INTEGER NOT NULL,
    typeId INTEGER NOT NULL,
    FOREIGN KEY (season) REFERENCES Season(seasonId),
    FOREIGN KEY (typeId) REFERENCES ClothingType(typeId)
);

CREATE TABLE IF NOT EXISTS ClothingType (
    typeId INTEGER NOT NULL,
    typeName VARCHAR(200) NOT NULL,
    PRIMARY KEY (typeId)
);

CREATE TABLE IF NOT EXISTS Season (
    seasonId INTEGER NOT NULL,
    seasonName VARCHAR(200) NOT NULL,
    PRIMARY KEY (seasonId)
);

CREATE TABLE IF NOT EXISTS UserCloset (
    userId VARCHAR(200) NOT NULL,
    clothId INTEGER NOT NULL,
    PRIMARY KEY (userId, clothId),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (clothId) REFERENCES Clothes(clothId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserFavoriteCombination (
    favoriteCombinationId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId VARCHAR(200) NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE IF NOT EXISTS FavoriteCombinationClothes (
    favoriteCombinationId INTEGER NOT NULL,
    clothId INTEGER NOT NULL,
    PRIMARY KEY (favoriteCombinationId, clothId),
    FOREIGN KEY (favoriteCombinationId) REFERENCES UserFavoriteCombination(favoriteCombinationId),
    FOREIGN KEY (clothId) REFERENCES Clothes(clothId)
);

CREATE TABLE IF NOT EXISTS RecentlyViewedCombination (
    recentCombinationId INTEGER PRIMARY KEY AUTOINCREMENT,
    clothId VARCHAR(200) NOT NULL,
    FOREIGN KEY (clothId) REFERENCES Clothes(clothId)
);

CREATE TABLE IF NOT EXISTS UserRecentlyViewedCombination (
    recentCombinationId INTEGER NOT NULL,
    userId VARCHAR(200) NOT NULL,
    viewedAt TIMESTAMP NOT NULL,
    PRIMARY KEY (recentCombinationId, userId),
    FOREIGN KEY (recentCombinationId) REFERENCES RecentlyViewedCombination(recentCombinationId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);
