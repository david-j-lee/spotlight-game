import React, { FC, useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useContext } from '../../context';
import firebase from 'firebase';

interface IProps {
  component: any;
  path: string;
  exact?: boolean;
}

export const PrivateRoute: FC<IProps> = (props) => {
  const [{ isLoaded, auth }, { loadAssets, setAuth }] = useContext();
  const { userId, isAuthenticated, failedAutoLogin } = auth;
  const [ready, setReady] = useState(isAuthenticated);

  useEffect(() => {
    if (!userId && !failedAutoLogin) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setAuth({
            email: user.email,
            userId: user.uid,
            isAuthenticated: true,
          });
          if (!isLoaded) {
            loadAssets(user.uid);
          }
        } else {
          setAuth({ failedAutoLogin: true });
        }
      });
    } else {
      setReady(true);
    }
  }, [isLoaded, userId, failedAutoLogin, setAuth, loadAssets]);

  const link = document.createElement('a');
  link.href = props.path;
  const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
  const redirectUrl = `/login/${encodeURI(returnUrl).replace(/\//g, '%2F')}`;
  if (ready) {
    const { component: Component, ...rest } = props;
    return (
      <Route
        {...rest}
        render={(props) => {
          if (userId) {
            return <Component {...props} />;
          } else {
            return <Redirect to={redirectUrl} />;
          }
        }}
      />
    );
  }

  return <div></div>;
};

export default PrivateRoute;
