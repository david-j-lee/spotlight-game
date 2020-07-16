import React, { FC, useState, FormEvent } from 'react';
import { Redirect } from 'react-router-dom';
import firebase, { auth } from '../firebase';

import { makeStyles, Theme } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../context';

const Login: FC = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [, { setAuth }] = useContext();

  const login = () => {
    auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        const res: any = await auth.signInWithEmailAndPassword(email, password);
        if (res.user) {
          setAuth({
            userId: res.user.uid,
            isAuthenticated: true,
            failedAutoLogin: false,
          });
          setShouldRedirect(true);
        }
      })
      .catch((err) => {
        setPassword('');
        setError(err.message);
      });
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login();
  };

  if (shouldRedirect) {
    return <Redirect to="/" />;
  }

  return (
    <div className={[classes.root, 'styled-scrollbar'].join(' ')}>
      <Typography variant="h1" className={classes.title}>
        <small>Into the</small>
        <br /> <strong>Spotlight</strong>
      </Typography>
      <form
        onSubmit={handleOnSubmit}
        noValidate={false}
        className={classes.form}
      >
        <TextField
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          variant="filled"
          size="small"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          variant="filled"
          size="small"
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </form>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    overflow: 'auto',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    maxWidth: '300px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    '& > *': {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
  },
  title: {
    textAlign: 'center',
    '& strong': {
      color: 'yellow',
    },
  },
}));

export default Login;
