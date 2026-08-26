import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface TOrderState {
  order: TOrder | null;
  isRequested: boolean;
  error: string | null;
  orderSuccess: boolean;
}

const initialState: TOrderState = {
  order: null,
  isRequested: false,
  error: null,
  orderSuccess: false
};

export const orderBurger = createAsyncThunk(
  'orderCurrent',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

const orderCurrentSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    removeOrder: (state) => {
      state.order = null;
    }
  },
  selectors: {
    selectOrder: (sliceState) => sliceState.order,
    selectOrderIsRequested: (sliceState) => sliceState.isRequested,
    selectOrderError: (sliceState) => sliceState.error,
    selectOrderSuccess: (sliceState) => sliceState.orderSuccess
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.order = null;
        state.isRequested = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.order = null;
        state.isRequested = false;
        state.error = 'Ой, что-то пошло не так...';
        state.orderSuccess = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        const newOrder = action.payload.order;
        state.order = {
          _id: newOrder._id,
          status: newOrder.status,
          name: newOrder.name,
          createdAt: newOrder.createdAt,
          updatedAt: newOrder.updatedAt,
          number: newOrder.number,
          ingredients: action.meta.arg
        };
        state.isRequested = false;
        state.error = null;
        state.orderSuccess = true;
      });
  }
});

export const {
  selectOrder,
  selectOrderIsRequested,
  selectOrderError,
  selectOrderSuccess
} = orderCurrentSlice.selectors;
export const { removeOrder } = orderCurrentSlice.actions;
export default orderCurrentSlice.reducer;
