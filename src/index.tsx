import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import AlertDialog from './components/AlertDialog/AlertDialog';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import { SnackbarProvider } from 'notistack';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const VideoApp = () => {
  const { error, setError, alert, setAlert, confirm, setConfirm } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <UnsupportedBrowserWarning>
      <VideoProvider options={connectionOptions} onError={setError}>
        <ErrorDialog
          dismissError={() => {
            setError(null);
            window.location.reload();
          }}
          error={error}
        />
        <AlertDialog
          dismissAlert={() => {
            setAlert(null);
          }}
          alert={alert}
        />
        <ConfirmDialog setConfirm={setConfirm} confirm={confirm} />
        <App />
      </VideoProvider>
    </UnsupportedBrowserWarning>
  );
};

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider
      maxSnack={8}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={10000}
      variant="info"
    >
      <Router>
        <AppStateProvider>
          <Switch>
            <PrivateRoute exact path="/">
              <VideoApp />
            </PrivateRoute>
            <PrivateRoute path="/room/:URLRoomName">
              <VideoApp />
            </PrivateRoute>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Redirect to="/" />
          </Switch>
        </AppStateProvider>
      </Router>
    </SnackbarProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
