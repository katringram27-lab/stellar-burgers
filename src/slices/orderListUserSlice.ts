import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface TUserState {
  orders: TOrder[];
  isRequested: boolean;
  error: string | null;
}

const initialState: TUserState = {
  orders: [],
  isRequested: false,
  error: null
};

export const getOrders = createAsyncThunk(
  'orders',
  async () => await getOrdersApi()
);

const orderListAllUsersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = action.payload;
      state.error = null;
    }
  },
  selectors: {
    selectOrders: (sliceState) => sliceState.orders,
    selectOrderIsRequested: (sliceState) => sliceState.isRequested,
    selectOrdersError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.orders = [];
        state.isRequested = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.orders = [];
        state.isRequested = false;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isRequested = false;
        state.error = null;
      });
  }
});
export const { setOrders } = orderListAllUsersSlice.actions;
export const { selectOrders, selectOrderIsRequested, selectOrdersError } =
  orderListAllUsersSlice.selectors;
export default orderListAllUsersSlice.reducer;
