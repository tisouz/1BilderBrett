import React, { useState, useEffect } from 'react';
import './ChangePassword.css';
import jwtDecode from 'jwt-decode';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { logout } from '../../../store/AuthSlice';

import {instance as axios} from '../../../axios-content';
import { setBulmaButtonClasses, getAuthorizationHeader } from '../../../util';

interface ErrorResponse {
  password: string[] | null,
  old_password: string[] | null,
};

const ChangePassword = () => {
  const tokens = useAppSelector((state) => state.auth.tokens);
  const dispatch = useAppDispatch();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setCanSubmit(newPassword.length > 0 && newPasswordConfirm.length > 0 && oldPassword.length > 0);
  }, [newPassword, newPasswordConfirm, oldPassword]);

  const passwordsMatch = () => {
    return newPassword === newPasswordConfirm;
  }

  const submitPasswordChange = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    if (!passwordsMatch()) {
      setErrorText("The passwords you entered don't match");
      return;
    }
    if (tokens === null)
      return;

    setIsLoading(true);
    setCanSubmit(false);

    const decodedToken: any = jwtDecode(tokens.accessToken);
    const user_id: number = decodedToken.user_id;

    const data = {
      'password': newPassword,
      'old_password': oldPassword
    }

    axios.put('changePassword/' + user_id, data,
      getAuthorizationHeader(tokens.accessToken))
      .then(res => {
        setErrorText("");
        setIsLoading(false);
        setCanSubmit(true);
        dispatch(logout());
      })
      .catch(err => {
        let text = "";
        let response: ErrorResponse = err.response.data;
        // eslint-disable-next-line
        for (const [key, value ] of Object.entries(response)) {
          text += value.reduce((val: any, ret: any) => ret + val);
        }
        setIsLoading(false);
        setCanSubmit(true);
        setErrorText(text);
      });
  }

  return (
    <form className='PasswordChangeContainer'>
      <div className='field'>
        <label className='label'>old password</label>
        <div className='control'>
          <input className='input'
            type='password'
            placeholder='old plassword'
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
          />
        </div>
      </div>

      <div className='field'>
        <label className='label'>new password</label>
        <div className='control'>
          <input className='input'
            type='password'
            placeholder='new plassword'
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
      </div>

      <div className='field'>
        <label className='label'>confirm new password</label>
        <div className='control'>
          <input className='input'
            type='password'
            placeholder='confirm new plassword'
            value={newPasswordConfirm}
            onChange={(event) => setNewPasswordConfirm(event.target.value)}
          />
        </div>
      </div>

      <div className='control'>
        <button className={setBulmaButtonClasses(isLoading)}
          onClick={(event) => submitPasswordChange(event)}
          disabled={!canSubmit}>change password</button>
      </div>
      <p>{errorText}</p>
    </form>
  );
}

export default ChangePassword;