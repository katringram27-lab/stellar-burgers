import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface IIngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredientsState = {
  items: [],
  isLoading: true,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (sliceState) => sliceState.items,
    selectIngredientsIsLoading: (sliceState) => sliceState.isLoading,
    selectIngredientsError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchIngredients.rejected, (state) => {
      state.isLoading = false;
      state.error = 'Ой, что-то пошло не так...';
    });
  }
});

export const {
  selectIngredients,
  selectIngredientsIsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
