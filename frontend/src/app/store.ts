import {configureStore} from '@reduxjs/toolkit';
//import reducers
import authReducer from '../store/AuthSlice';
import previewsReducer from '../store/PreviewsSlice';
import tagReducer from '../store/TagSlice';
import postReducer from '../store/PostSlice';

import { autoTokenRefreshInterceptor } from '../axios-content';

export const store = configureStore({
  reducer: {
    //name: reducer
    auth: authReducer,
    previews: previewsReducer,
    tag: tagReducer,
    post: postReducer,
  }
});

autoTokenRefreshInterceptor(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;