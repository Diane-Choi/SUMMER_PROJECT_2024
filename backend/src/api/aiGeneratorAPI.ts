import express from "express";
import { getAllClothesByUserIdAndClothIds } from "../database/clothes";
import { aiRecommendation } from "../ai/ai";

const app = express();

const router = express.Router();

router.post("/ai-generator", async (req, res) => {
  const { userId, selectedCategory, selectedCategoryCheckbox, selectedItem } = req.body;
  
    // AI Generation Logic Here
    // This code is just a template and should be replaced with actual AI generation logic
    // Return => res.json({selectedItem: selectedItem, generatedItems: generatedItems });

    console.log('selectedItem:', selectedItem);
    const result = await aiRecommendation(userId, selectedItem, selectedCategoryCheckbox)
    
    if (!result) {
      return res.status(400).json({ error: 'No cloth IDs generated' });
    }
    const { clothIds, explanation } = result;
    const generatedItems = await getAllClothesByUserIdAndClothIds(userId, clothIds);

    
    return res.json({
      selectedItem: selectedItem,
      generatedItems: generatedItems,
      explanation: explanation,
    });

});

export default router;
