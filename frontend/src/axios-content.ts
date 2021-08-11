import axios from 'axios';
import { store as ReduxStore } from './app/store';
import { interceptorRefreshRejected, interceptorRefreshStart, logout, Tokens, interceptorRefreshFullfilled } from './store/AuthSlice';

const baseURL = 'https://www.1bilderbrett.com/api/v1/imageBoard/';
//const baseURL = 'http://127.0.0.1:8000/api/v1/imageBoard/';

export const instance = axios.create({
  baseURL: baseURL
});


export const autoTokenRefreshInterceptor = (store: (typeof ReduxStore)) => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    }, (error) => {
      const oldTokens = store.getState().auth.tokens;
      //forward errors
      if (error.response.status !== 401 || error.config.url === '/token/' || oldTokens === null)
        return new Promise((resolve, reject) => {
          reject(error);
        });

      if (error.config.url === '/token/refresh/') {
        return new Promise((resolve, reject) => {
          reject(error);
          store.dispatch(logout());
        });
      }

      
      //get new tokens
      store.dispatch(interceptorRefreshStart());
      return instance.post('/token/refresh/', {'refresh': oldTokens.refreshToken})
        .then(res => {
          const newTokens: Tokens = {
            accessToken: res.data.access,
            refreshToken: res.data.refresh
          }
          store.dispatch(interceptorRefreshFullfilled(newTokens));
          
          //retry request
          const config = error.config;
          config.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
          return new Promise ((resolve, reject) => {
            axios.request(config)
            .then(res => {
              resolve(res)
            })
            .catch(err => {
              reject(err);
            })
          });
        })
        .catch(err => {
          store.dispatch(interceptorRefreshRejected());
        })

    }
  );
}