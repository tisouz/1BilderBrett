import React, {useEffect} from "react";
import {Redirect} from 'react-router-dom';

import {useAppDispatch} from '../../app/hooks';
import {logout} from '../../store/AuthSlice';

const Logout = () => {
   
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(logout());
  });
  
  dispatch(logout);
  return <Redirect to="/" />;
}

export default Logout;
  