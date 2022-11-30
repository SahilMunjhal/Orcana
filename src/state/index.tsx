import React, { createContext, useContext, useReducer, useState } from 'react';
import { RoomType } from '../types';
import { TwilioError } from 'twilio-video';
import { settingsReducer, initialSettings, Settings, SettingsAction } from './settings/settingsReducer';
import useActiveSinkId from './useActiveSinkId/useActiveSinkId';
import useFirebaseAuth from './useFirebaseAuth/useFirebaseAuth';
import usePasscodeAuth from './usePasscodeAuth/usePasscodeAuth';
import useOrcanaAuth from './useOrcanaAuth/useOrcanaAuth';
import { User } from 'firebase';

export interface StateContextType {
  error: TwilioError | null;
  setError(error: TwilioError | null): void;
  alert: { title: string; message: string } | null;
  setAlert(alert: { title: string; message: string } | null): void;
  confirm: {
    title: String;
    message: String;
    confirmButton: String;
    cancelButton: String;
    dismissConfirm: Function;
  } | null;
  setConfirm(
    confirm: {
      title: String;
      message: String;
      confirmButton: String;
      cancelButton: String;
      dismissConfirm: Function;
    } | null
  ): void;
  getToken(name: string, room: string, passcode?: string): Promise<string>;
  user?: User | null | { displayName: undefined; photoURL: undefined; passcode?: string };
  orcanaUser?: null | { apiToken?: string | null | undefined; canAdmin?: boolean };
  signIn?(passcode?: string): Promise<void>;
  signOut?(): Promise<void>;
  isAuthReady?: boolean;
  isFetching: boolean;
  activeSinkId: string;
  setActiveSinkId(sinkId: string): void;
  settings: Settings;
  dispatchSetting: React.Dispatch<SettingsAction>;
  roomType?: RoomType;
}

export const StateContext = createContext<StateContextType>(null!);

/*
  The 'react-hooks/rules-of-hooks' linting rules prevent React Hooks fron being called
  inside of if() statements. This is because hooks must always be called in the same order
  every time a component is rendered. The 'react-hooks/rules-of-hooks' rule is disabled below
  because the "if (process.env.REACT_APP_SET_AUTH === 'firebase')" statements are evaluated
  at build time (not runtime). If the statement evaluates to false, then the code is not
  included in the bundle that is produced (due to tree-shaking). Thus, in this instance, it
  is ok to call hooks inside if() statements.
*/
export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string;
    message: string;
    confirmButton: string;
    cancelButton: string;
    dismissConfirm: Function;
  } | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [settings, dispatchSetting] = useReducer(settingsReducer, initialSettings);

  let contextValue = {
    error,
    setError,
    alert,
    setAlert,
    confirm,
    setConfirm,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    settings,
    dispatchSetting,
  } as StateContextType;

  if (process.env.REACT_APP_SET_AUTH === 'firebase') {
    contextValue = {
      ...contextValue,
      ...useFirebaseAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else if (process.env.REACT_APP_SET_AUTH === 'passcode') {
    contextValue = {
      ...contextValue,
      ...usePasscodeAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else if (process.env.REACT_APP_ORCANA_AUTH === 'true') {
    contextValue = {
      ...contextValue,
      ...useOrcanaAuth(), // eslint-disable-line react-hooks/rules-of-hooks
    };
  } else {
    contextValue = {
      ...contextValue,
      getToken: async (identity, roomName) => {
        const headers = new window.Headers();
        const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/api/v1/webtoken';
        const params = new window.URLSearchParams({ identity, roomName });

        return fetch(`${endpoint}?${params}`, { headers }).then(res => res.json().then(data => data['token']));
      },
    };
  }

  const getToken: StateContextType['getToken'] = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then(res => {
        if (res == 'CASE_DOES_NOT_EXIST') {
          throw {
            message:
              'This Case number is not valid, please contact your Medical Device Rep for the correct Case number.',
          };
        }
        if (res == 'CASE_IS_NOT_ACTIVE') {
          throw { message: 'This session has not started. Please contact your Medical Device Rep to begin.' };
        }
        setIsFetching(false);
        return res;
      })
      .catch(err => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };

  return <StateContext.Provider value={{ ...contextValue, getToken }}>{props.children}</StateContext.Provider>;
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
