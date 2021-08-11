import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance as axios } from '../axios-content';

import { getAuthorizationHeader } from '../util'

interface Preview {
  id: number,
  thumbnail: string,
}

interface PreviewsState {
  error: string | null | undefined,
  loading: boolean,
  moreAvailable: boolean,
  previous: string | null,
  next: string | null,
  previews: Preview[],
}

interface FetchResponse {
  previous: string | null,
  next: string | null,
  previews: Preview[],
}

interface InitialFetchArguments {
  accessToken: string,
  tags: string[]
}

interface FurtherFetchArguemnts {
  accessToken: string,
  next: string,
}

const initialState: PreviewsState = {
  error: null,
  loading: false,
  moreAvailable: false,
  previous: null,
  next: null,
  previews: []
}

export const fetchInitialPreviews = createAsyncThunk<
  FetchResponse, //Return type
  InitialFetchArguments,
  {
    rejectValue: string
  }
>('previews/fetchInitialPreviews',
  (fetchArguments: InitialFetchArguments, thunkAPI) => {
    let endpoint = '/posts';
    if (fetchArguments.tags.length > 0)
      endpoint += '?tags='.concat(fetchArguments.tags.join('+'));

    const authHeader = getAuthorizationHeader(fetchArguments.accessToken);

    return axios.get(endpoint, authHeader)
      .then(res => {
        const response: FetchResponse = {
          previous: res.data.previous ? res.data.previous : null,
          next: res.data.next ? res.data.next : null,
          previews: res.data.results
        }
        return response;
      })
      .catch(err => {
        return thunkAPI.rejectWithValue(err.response.data.detail);
      })
  }
);

export const fetchFurtherPreviews = createAsyncThunk<
  FetchResponse,
  FurtherFetchArguemnts,
  {
    rejectValue: string
  }
>('previews/fetchFurtherPreviews',
  (fetchArguments: FurtherFetchArguemnts, thunkAPI) => {
    const authHeader = getAuthorizationHeader(fetchArguments.accessToken);

    return axios.get(fetchArguments.next, authHeader)
      .then(res => {
        const response: FetchResponse = {
          previous: res.data.previous ? res.data.previous : null,
          next: res.data.next ? res.data.next : null,
          previews: res.data.results
        }
        return response;

      })
      .catch(err => {
        return thunkAPI.rejectWithValue(err.response.data.detail);
      })
  }
);

const previewsSlice = createSlice({
  name: 'previews',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    //fetchInitialPreviews
    builder.addCase(fetchInitialPreviews.fulfilled, (state, action) => {
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.previews = action.payload.previews;
      state.error = null;
      state.loading = false;
      state.moreAvailable = action.payload.next === null ? false : true;
    });
    builder.addCase(fetchInitialPreviews.rejected, (state, action) => {
      state.next = null;
      state.previous = null;
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchInitialPreviews.pending, (state) => {
      state.loading = true;
    });
    //fetchFurtherPreviews
    builder.addCase(fetchFurtherPreviews.fulfilled, (state, action) => {
      state.next = action.payload.next;
      state.previous = action.payload.previous;
      state.previews = state.previews.concat(action.payload.previews);
      state.error = null;
      state.loading = false;
      state.moreAvailable = action.payload.next === null ? false : true;
    });
    builder.addCase(fetchFurtherPreviews.rejected, (state, action) => {
      state.next = null;
      state.previous = null;
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchFurtherPreviews.pending, (state, action) => {
      state.loading = true;
    });
    
  }
});

//export const { } = previewsSlice.actions;
export default previewsSlice.reducer;