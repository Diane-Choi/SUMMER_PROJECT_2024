import Configuration from 'openai';
import OpenAI from 'openai';
import { Cloth, getAllClothesByTypesAndSeasons } from '../database/clothes';

import {
  convertSeasonIdsToSeasons,
  convertTypeIdsToCategories,
  convertTypeIdToCategory,
} from '../utils/convertId';
import 'dotenv/config';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiRecommendation = async (
  userId: string,
  selectedItem: Cloth,
  selectedCategoryCheckbox: number[]
): Promise<{ clothIds: number[]; explanation: string } | undefined> => {
  const seasonsStr = convertSeasonIdsToSeasons(selectedItem.season);
  const toBeMatchedtypesStr = convertTypeIdsToCategories(
    selectedCategoryCheckbox
  );
  const selectedCategoryStr = convertTypeIdToCategory(selectedItem.typeId);
  const clothesByTypeAndSeasons = await getAllClothesByTypesAndSeasons(
    userId,
    selectedCategoryCheckbox,
    selectedItem.season
  );
  try {
    const prompt = `
You are given the following details:
1. Selected cloth description: ${selectedItem.description}
2. Selected cloth type: ${selectedCategoryStr}
3. Preferred seasons: ${seasonsStr}

Additionally, the user has chosen to match this cloth with the following categories: ${toBeMatchedtypesStr.join(
      ', '
    )}.

Your task is to select exactly one cloth for each of the following types from the list below:
${toBeMatchedtypesStr.join(', ')}.

- Ensure that all selected clothIds are present in the list of available clothes below.
- The list of available clothes is provided to help you choose valid items.

*Clothes available (Please choose only from these items):
    ${clothesByTypeAndSeasons
      .map((item) => `${item.clothId}. ${item.description}`)
      .join('\n')}

*Please follow these instructions:
1. Select one item for each of the listed types from the available clothes.
2. Ensure that all selected clothIds are present in the list of available clothes.
3. Return your response in the following format:
   - An array of selected clothId(s) as a JSON array, like this: [1, 2, 3]
   - A brief description of the chosen clothing items, and why it's a good match but without referring to its sequence position (e.g., 'clothId 2'), starting with "Explanation:" IN ONE SENTENCE.
   
Please ensure that both parts are provided, with the explanation starting on a new line after the JSON array. You need to return ${
      toBeMatchedtypesStr.length
    } clothId(s) in the JSON array. You should not include the ${selectedCategoryStr} item in your response. The items' typeId in your reponse should not be repeated.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const recommendationText = response.choices[0].message?.content;

    const [clothIdsOfRecommendation, explanation] = (
      recommendationText || ''
    ).split('Explanation:');

    const clothIds: number[] = JSON.parse(clothIdsOfRecommendation.trim());

    console.log('Recommendation:', clothIdsOfRecommendation);
    console.log('Explanation:', explanation);

    return { clothIds, explanation };
  } catch (error) {
    console.error('Error with OpenAI API:', error);
  }
};

// {
//     "id": "chatcmpl-123",
//     "object": "chat.completion",
//     "created": 1677652288,
//     "model": "gpt-4o-mini",
//     "system_fingerprint": "fp_44709d6fcb",
//     "choices": [{
//       "index": 0,
//       "message": {
//         "role": "assistant",
//         "content": "\n\nHello there, how may I assist you today?",
//       },
//       "logprobs": null,
//       "finish_reason": "stop"
//     }],
//     "usage": {
//       "prompt_tokens": 9,
//       "completion_tokens": 12,
//       "total_tokens": 21
//     }
//   }
