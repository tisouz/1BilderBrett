import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useAppSelector } from './app/hooks';

import Navbar from './components/Navbar';

import Login from './containers/Auth/Login/Login';
import Logout from './containers/Auth/Logout';
import ChangePassword from './containers/Auth/ChangePassword/ChangePassword';
import Previews from './containers/Content/Previews/Previews';
import Post from './containers/Content/UserPost/Post';
import Home from './containers/Home';
import PostCreation from './components/PostCreation/PostCreation';
import { ToastContainer } from "react-toastify";

const App = () => {
  const tokens = useAppSelector((state) => state.auth.tokens);
  const isAuthenticated = tokens !== null;

  let routes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Redirect to="/login" />
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/logout" component={Logout} />
        <Route path="/changePassword" component={ChangePassword} />
        <Route path="/previews" component={Previews} />
        <Route path="/posts/:postId" component={Post} />
        <Route path="/create" component={PostCreation} />
        <Route path="/" component={Home} />
      </Switch>
    );
  }

  return (
    <div className='App'>
      <ToastContainer />
      <Navbar authenticated={isAuthenticated} />
      <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
    </div>
  )
}

export default App;
export const FRONTEND_URL = "https://www.1bilderbrett.com";
