import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../src/utils/cookie';

interface TUserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isSuccessRegistrarion: boolean;
  data: TUser | null;
  isRequested: boolean;
  error: string | null;
}

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  isSuccessRegistrarion: false,
  data: null,
  isRequested: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: Omit<TRegisterData, 'name'>,
    { rejectWithValue }
  ) => {
    const response = await loginUserApi({ email, password });
    setCookie('accessToken', response.accessToken, {
      expires: 1000000
    });
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: TRegisterData, { rejectWithValue }) => {
    const response = await registerUserApi({ name, email, password });
    setCookie('accessToken', response.accessToken, {
      expires: 1000000
    });
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updataUser',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async () => await getUserApi()
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await logoutApi();
  } finally {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    selectUser: (sliceState) => sliceState.data,
    selectUserIsRequested: (sliceState) => sliceState.isRequested,
    selectIsSuccessRegistrarion: (sliceState) =>
      sliceState.isSuccessRegistrarion,
    selectUserError: (sliceState) => sliceState.error,
    selectIsAuthChecked: (sliceState) => sliceState.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.data = null;
        state.isRequested = true;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        if (action.error.message === 'email or password are incorrect') {
          state.error = 'Неверный логин или пароль!';
        } else {
          state.error = 'Ой, что-то пошло не так...';
        }
        state.isSuccessRegistrarion = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isRequested = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })

      .addCase(registerUser.pending, (state) => {
        state.data = null;
        state.isRequested = true;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        if (action.error.message === 'User already exists') {
          state.error = 'Данный пользователь уже зарегистрирован!';
        } else {
          state.error = 'Ой, что-то пошло не так...';
        }
        state.isSuccessRegistrarion = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isRequested = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = true;
      })

      .addCase(getUser.pending, (state) => {
        state.data = null;
        state.isRequested = true;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isRequested = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })

      .addCase(logoutUser.pending, (state) => {
        state.isRequested = true;
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isRequested = false;
        state.error = 'Ой, что-то пошло не так...';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isRequested = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      })

      .addCase(updateUser.pending, (state) => {
        state.isRequested = true;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isRequested = false;
        state.isAuthenticated = true;
        state.error = 'Ой, что-то пошло не так...';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isRequested = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
        state.isSuccessRegistrarion = false;
      });
  }
});
export const {
  selectUser,
  selectUserIsRequested,
  selectUserError,
  selectIsSuccessRegistrarion,
  selectIsAuthChecked
} = userSlice.selectors;

export const { setAuthChecked } = userSlice.actions;

export default userSlice.reducer;
