import { Cloth } from "./clothes";
import { getDbConnection } from "./db";


export interface FavoriteCombination {
  favouriteCombinationId: number;
  userId: string;
  selectedItem: Cloth;
  generatedItems: Cloth[];
}

export async function fetchFavoriteItems(userId: string): Promise<FavoriteCombination[]> {
  const db = await getDbConnection();
  try {
    const result = await db.all(
      "SELECT * FROM UserFavoriteCombination WHERE userId = ?",
      userId, 
    );

    const favoriteItems = await Promise.all(
      result.map(async (row) => {
        const favouriteCombinationId = row.favoriteCombinationId;
        
        const selectedItem = await db.get(
          "SELECT Clothes.clothId, Clothes.typeId, Clothes.imgSrc FROM Clothes JOIN FavoriteCombinationClothes ON FavoriteCombinationClothes.clothId = Clothes.clothId WHERE favoriteCombinationId = ? AND isGenerated = 0",
          favouriteCombinationId
        );
        
        const generatedItems = await db.all(
          "SELECT Clothes.clothId, Clothes.typeId, Clothes.imgSrc FROM Clothes JOIN FavoriteCombinationClothes ON FavoriteCombinationClothes.clothId = Clothes.clothId WHERE favoriteCombinationId = ? AND isGenerated = 1",
          favouriteCombinationId
        );
        return {
          favouriteCombinationId,
          userId,
          selectedItem,
          generatedItems,
        };
      })
    );

    return favoriteItems;
  } catch (error) {
    console.error("An error occurred while fetching favourite items:", error);
    return [];
  }
  finally {
    await db.close();
  }
}

export async function addFavoriteCombination(
  userId: string,
  selectedItem: Cloth,
  generatedItems: Cloth[]
): Promise<void> {
  const db = await getDbConnection();
  try {
    await db.exec("BEGIN TRANSACTION");
    const result = await db.run(
      "INSERT INTO UserFavoriteCombination (userId) VALUES (?)",
      userId
    );

    const favouriteCombinationId = result.lastID;

    const insertPromises = generatedItems.map((item) =>
      db.run(
        "INSERT INTO FavoriteCombinationClothes (favoriteCombinationId, clothId, isGenerated) VALUES (?, ?, ?)",
        favouriteCombinationId,
        item.clothId,
        true
      )
    );
    await Promise.all(insertPromises);

    await db.run(
        "INSERT INTO FavoriteCombinationClothes (favoriteCombinationId, clothId, isGenerated) VALUES (?, ?, ?)",
        favouriteCombinationId,
        selectedItem.clothId,
        false
      )

    await db.exec("COMMIT");
    console.log("Favourite items saved successfully");
  } catch (error) {
    await db.exec('ROLLBACK');
    console.error('An error occurred while saving favourite items:', error)
  } finally {
    await db.close();
  }
}

export async function deleteFavoriteCombination(favoriteCombinationId: number): Promise<void> {
  const db = await getDbConnection();
  try {
    await db.run(
      "DELETE FROM UserFavoriteCombination WHERE favoriteCombinationId = ?",
      favoriteCombinationId
    );
    console.log(`Favorite combination with id ${favoriteCombinationId} has been deleted`);
  } catch (error) {
    console.error(`An error occurred while deleting favorite combination with id ${favoriteCombinationId}:`, error);
  } finally {
    await db.close();
  }
}

export async function replaceClothInFavorite(
  favoriteCombinationId: number,
  originalClothId: number,
  newClothId: number
): Promise<number> {
  const db = await getDbConnection();
  try {
    const query = `
      UPDATE FavoriteCombinationClothes
      SET clothId = ?
      WHERE favoriteCombinationId = ? AND clothId = ?
    `;

    const result = await db.run(query, [newClothId, favoriteCombinationId, originalClothId]);

    return result.changes as number;
  } catch (error) {
    console.error('Error replacing cloth in favorite combination:', error);
    throw error;
  } finally {
    await db.close();
  }
}
