import { configureStore } from '@reduxjs/toolkit';
import ingredients from '../slices/ingredientsSlice';
import constructorSliceReducer from '../slices/constructorSlice';
import userSliceReducer from '../slices//userSlice';
import orderListAllUsersSliceReducer from '../slices/feedSlice';
import orderCurrentSliceReducer from '../slices/orderCurrentSlice';
import orderListAllUsersSlicereducer from '../slices/orderListUserSlice';
import { useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    ingredients,
    constructorItems: constructorSliceReducer,
    user: userSliceReducer,
    feeds: orderListAllUsersSliceReducer,
    order: orderCurrentSliceReducer,
    orders: orderListAllUsersSlicereducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector(selector);

export default store;
