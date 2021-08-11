import React, { useEffect, useState } from 'react';
import {  useHistory } from 'react-router-dom';
import './Login.css'

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchTokens} from '../../../store/AuthSlice';

import {setBulmaButtonClasses} from '../../../util';

const Login = () => {
  const loading  = useAppSelector((state) => state.auth.loading);
  const tokens = useAppSelector((state) => state.auth.tokens);
  const errorMessage = useAppSelector((state) => state.auth.error);
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const history = useHistory();

  //redirect on login 
  useEffect(() => {
    if (tokens !== null) 
      history.push('/');
  }, [tokens, history]);

  const submitHandler = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const data  = {
      'username': username,
      'password': password 
    }
    dispatch(fetchTokens(data));
  }

  return (
    <form className='LoginContainer'>
      <div className='field'>
        <label className='label'>Username</label>
        <div className='control'>
          <input className='input'
            type='text'
            placeholder='username'
            value = {username}
            onChange = {(event) => setUsername(event.target.value)}
          />
        </div>
      </div>
      
      <div className='field'>
        <label className='label'>Password</label>
          <div className='control'>
            <input className='input'
              type='password'
              placeholder='plassword' 
              value = {password}
              onChange = {(event) => setPassword(event.target.value)}
            />
          </div>
      </div>
      
      <div className='control'>
        <button className={setBulmaButtonClasses(loading)} onClick={submitHandler}>Login</button>
      </div>

      <p>{errorMessage}</p>

    </form>
  );
}

export default Login;