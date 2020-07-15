import React, { FC } from 'react';
import firebase, { auth } from '../firebase';

import { useContext } from '../context';
import MainButton from './MainButton';

import './Login.css';

const Login: FC = () => {
  const [, { setUser }] = useContext();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  const login = () => {
    // TODO: Remove use of any
    const email = (document.getElementById('login-email') as any).value;
    const password = (document.getElementById('login-pwd') as any).value;

    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
      const res = await auth.signInWithEmailAndPassword(email, password);

      if (res.user && setUser) {
        setUser(res.user);
        console.log('test');
      } else {
        // TODO: Remove use of any
        (document.getElementById('login-pwd') as any).value = '';
      }
    });
  };

  return (
    <div className="login-container">
      <h3>Sign in</h3>
      <div className="login">
        <label>
          Email:
          <input id="login-email" />
        </label>
        <label>
          Password:
          <input type="password" id="login-pwd" onKeyUp={handleKeyPress} />
        </label>
        <div className="submit">
          <MainButton actionTitle="Submit" simple={true} clickHandler={login} />
        </div>
      </div>
    </div>
  );
};

export default Login;
