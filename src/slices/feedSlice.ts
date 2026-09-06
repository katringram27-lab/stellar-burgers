import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TFeedCounts = {
  total: number;
  totalToday: number;
};

interface TFeedsState {
  orders: TOrder[];
  orderData: TOrder | null;
  counts: TFeedCounts;
  isRequested: boolean;
  error: string | null;
}

const counts: TFeedCounts = {
  total: 0,
  totalToday: 0
};

const initialState: TFeedsState = {
  orders: [],
  orderData: null,
  counts: counts,
  isRequested: false,
  error: null
};

export const getFeeds = createAsyncThunk('ordersFeeds', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'orderFeed',
  async (number: number) => await getOrderByNumberApi(number)
);

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    setFeed: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.counts.total = action.payload.total;
      state.counts.totalToday = action.payload.totalToday;
      state.error = null;
    }
  },
  selectors: {
    selectFeed: (sliceState) => sliceState.orders,
    selectOrderData: (sliceState) => sliceState.orderData,
    selectFeedCounts: (sliceState) => sliceState.counts,
    selectFeedIsRequested: (sliceState) => sliceState.isRequested,
    selectFeedError: (sliceState) => sliceState.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.orders = [];
        state.isRequested = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.orders = [];
        state.isRequested = false;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.counts.total = action.payload.total;
        state.counts.totalToday = action.payload.totalToday;
        state.isRequested = false;
        state.error = null;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.orderData = null;
        state.isRequested = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderData = null;
        state.isRequested = false;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isRequested = false;
        if (action.payload.orders.length) {
          state.orderData = action.payload.orders[0];
          state.error = null;
        } else {
          state.orderData = null;
          state.error = 'Кажется заказа с таким номером нет...';
        }
      });
  }
});
export const { setFeed } = feedSlice.actions;
export const {
  selectFeed,
  selectOrderData,
  selectFeedCounts,
  selectFeedIsRequested,
  selectFeedError
} = feedSlice.selectors;
export default feedSlice.reducer;
