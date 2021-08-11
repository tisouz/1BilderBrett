import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { instance as axios } from '../axios-content';



export interface Tokens {
  accessToken: string,
  refreshToken: string
}

interface AuthState {
  loading: boolean,
  error: string | null | undefined,
  tokens: Tokens | null,
}

interface LoginInfo {
  username: string,
  password: string
}

interface RefreshInfo {
  refreshToken: string
}

const retrieveTokens = () => {
  const storedTokens = localStorage.getItem('tokens');
  if (storedTokens === null)
    return null;
  else {
    const parsed: any = JSON.parse(storedTokens.toString());
    const tokens: Tokens = {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    }
    return tokens;
  }
}

const initialState: AuthState = {
  loading: false,
  error: null,
  tokens: retrieveTokens(),
};



export const fetchTokens = createAsyncThunk<
  Tokens, //Return type
  LoginInfo, //argument to axios call
  {
    rejectValue: string //rejectValue type
  }
>('auth/fetchTokens',
  (loginInfo: LoginInfo, thunkAPI) =>
    axios.post('/token/', { 'username': loginInfo.username, 'password': loginInfo.password })
      .then(res => {
        const tokens: Tokens = {
          accessToken: res.data.access,
          refreshToken: res.data.refresh
        }
        localStorage.setItem('tokens', JSON.stringify(tokens));
        return tokens;
      })
      .catch(err => {
        return thunkAPI.rejectWithValue(err.response.data.detail);
      }),
);

export const refreshTokens = createAsyncThunk<
  Tokens, //Return type
  RefreshInfo,
  {
    rejectValue: string //rejectValue type
  }
>('auth/refreshTokens',
  (refreshInfo, thunkAPI) =>
    axios.post('/token/refresh/', {'refresh': refreshInfo.refreshToken})
      .then(res => {
        const tokens: Tokens = {
          accessToken: res.data.access,
          refreshToken: res.data.refresh
        }
        localStorage.setItem('tokens', JSON.stringify(tokens));
        return tokens;
      })
      .catch(err => {
        return thunkAPI.rejectWithValue(err.response.data.detail);
      })
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.tokens = null;
      localStorage.removeItem('tokens');
    },
    interceptorRefreshStart(state) {
      state.loading = true;
    },
    interceptorRefreshFullfilled(state, action: PayloadAction<Tokens>) {
      state.tokens = action.payload;
      localStorage.setItem('tokens', JSON.stringify(action.payload));
      state.loading = false;
    },
    interceptorRefreshRejected(state) {
      state.tokens = null;
      localStorage.removeItem('tokens');
      state.loading = false;
    }

  },
  extraReducers: (builder) => {
    builder.addCase(fetchTokens.fulfilled, (state, action) => {
      //sync with localstorage somehow?
      state.tokens = action.payload
      state.error = null;
      state.loading = false;
    });
    builder.addCase(fetchTokens.rejected, (state, action) => {
      state.tokens = null;
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTokens.pending, (state) => {
      state.loading = true;
    });

    //refreshToken
    builder.addCase(refreshTokens.fulfilled, (state, action) => {
      state.tokens = action.payload
      state.error = null;
      state.loading = false;
    })
    builder.addCase(refreshTokens.rejected, (state, action) => {
      state.tokens = null;
      localStorage.removeItem('tokens');
      state.loading = false;
    })
    builder.addCase(refreshTokens.pending, (state) => {
      state.loading = true;
    })
  }
});

export const { logout, interceptorRefreshFullfilled, interceptorRefreshStart, interceptorRefreshRejected } = authSlice.actions;
export default authSlice.reducer;