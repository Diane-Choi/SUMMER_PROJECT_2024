import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSeasonId, getTypeId } from '../../utils/api/getId';

export interface ClosetItem {
  clothId?: number;
  userId: string;
  description: string;
  imgSrc: string;
  seasonIds: string[];
  typeId: string;
}

interface ClosetItemState {
  closetItems: ClosetItem[];
}

const initialState: ClosetItemState = {
  closetItems: [],
};

interface FetchClosetItemsPayload {
  category: string;
  seasons: string[];
}

export const fetchClosetItems = createAsyncThunk(
  'closetItems/fetch',
  async (category: string, thunkAPI) => {
    try {
      const categoryId = getTypeId(category);
      const userId = localStorage.getItem('uid') as string;
      const response = await fetch(
        `/api/closet-items/${categoryId}?userId=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: 'Network error' });
    }
  }
);

// export const fetchClosetItemsBySeasonAndType = createAsyncThunk(
//   "closetItemsBySeasonAndType/fetch",
//   async ({ category, seasons }: FetchClosetItemsPayload, thunkAPI) => {
//     try {
//       // const categoryId = await getTypeId(category);
//       // const seasonId = await getSeasonId(season);
//       const userId = localStorage.getItem("uid") as string;
//       const response = await fetch(
//         `/api/closet-items/${category}/season/${season}?userId=${userId}`
//       );

//       if (response.ok) {
//         const data = await response.json();
//         return data;
//       }
//     } catch (error) {
//       console.error("Network error:", error);
//       return thunkAPI.rejectWithValue({ message: "Network error" });
//     }
//   }
// );

export const fetchClosetItemsBySeasonAndType = createAsyncThunk(
  'closetItemsBySeasonAndType/fetch',
  async ({ category, seasons }: FetchClosetItemsPayload, thunkAPI) => {
    try {
      const userId = localStorage.getItem('uid') as string;
      const response = await fetch(
        `/api/closet-items/${category}/season?seasons=${(
          getSeasonId(seasons) || []
        ).join(',')}&userId=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Network error:', error);
      return thunkAPI.rejectWithValue({ message: 'Network error' });
    }
  }
);

export const saveClosetItems = createAsyncThunk(
  "closetItems/save",
  async (
    { userId, description, imgSrc, seasonIds, typeId }: ClosetItem,
    thunkAPI
  ) => {
    const convertedTypeId = getTypeId(typeId);
    const convertedSeason = getSeasonId(seasonIds);
    try {
      const response = await fetch("/api/save-cloth", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          description,
          imgSrc,
          convertedSeason,
          convertedTypeId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save item.');
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
    }
  }
);

export const updateClosetItems = createAsyncThunk(
  'closetItems/update',
  async ({ clothId, userId, description, seasonIds }: ClosetItem, thunkAPI) => {
    try {
      const response = await fetch(`/api/update-cloth/${clothId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          description,
          seasons: seasonIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item.');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      return thunkAPI.rejectWithValue({ message: 'error' });
    }
  }
);

export const deleteClosetItems = createAsyncThunk(
  'closetItems/delete',
  async (
    {
      clothId,
      typeId,
      userId,
    }: { clothId: number; typeId: number; userId: string },
    thunkAPI
  ) => {
    try {
      const url = `api/delete-cloth/${clothId}?typeId=${typeId}&userId=${userId}`;
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error:', error);
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

export const ClosetItemSlice = createSlice({
  name: 'closetItem',
  initialState,
  reducers: {
    addClosetItems: (
      state: ClosetItemState,
      action: PayloadAction<ClosetItem>
    ) => {
      state.closetItems.push({
        typeId: action.payload.typeId,
        seasonIds: action.payload.seasonIds,
        imgSrc: action.payload.imgSrc,
        clothId: action.payload.clothId,
        userId: action.payload.userId,
        description: action.payload.description,
      });
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      fetchClosetItems.fulfilled,
      (state: ClosetItemState, action: PayloadAction<ClosetItemState>) => {
        state.closetItems = action.payload as unknown as ClosetItem[];
      }
    );
    builder.addCase(
      fetchClosetItemsBySeasonAndType.fulfilled,
      (state: ClosetItemState, action: PayloadAction<ClosetItem[]>) => {
        state.closetItems = action.payload;
      }
    );
    builder.addCase(
      saveClosetItems.fulfilled,
      (state: ClosetItemState, action: PayloadAction<ClosetItem>) => {
        state.closetItems.push(action.payload);
      }
    );
    builder.addCase(
      deleteClosetItems.fulfilled,
      (state: ClosetItemState, action: PayloadAction<ClosetItem>) => {
        state.closetItems = state.closetItems.filter(
          (item) => item.clothId !== action.payload.clothId
        );
      }
    );
  },
});

export default ClosetItemSlice.reducer;
export const { addClosetItems } = ClosetItemSlice.actions;
