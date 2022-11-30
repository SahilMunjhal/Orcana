import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TwilioError } from 'twilio-video';

export function getTokenFromUrl() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('token');
  return token;
}

export function fetchToken(name: string, room: string, tokenFromUrl: string | null | undefined) {
  const headers = new window.Headers();
  if (tokenFromUrl !== null && tokenFromUrl !== undefined) {
    headers.append('Authorization', tokenFromUrl);
  }

  const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/api/v1/webtoken';
  const params = new window.URLSearchParams({ identity: name, roomName: room });

  return fetch(`${endpoint}?${params}`, { headers });
}

export function getErrorMessage(message: string) {
  switch (message) {
    case 'CASE_DOES_NOT_EXIST':
      return 'This Case number is not valid, please contact your Medical Device Rep for the correct Case number.';
    case 'CASE_IS_NOT_ACTIVE':
      return 'This session has not started. Please contact your Medical Device Rep to begin.';
    case 'ADMIN_TOKEN_INVALID':
      return 'This link is incorrect. Please check your account or email to get the correct link.';
    case 'CASE_EXPIRED':
      return 'This Case ID is expired. Please try again or contact the case creator.';
    default:
      return message;
  }
}

export default function useOrcanaAuth() {
  const history = useHistory();
  const [error, setError] = useState<TwilioError | null>(null);

  const [orcanaUser, setOrcanaUser] = useState<{ apiToken?: string | null | undefined; canAdmin: boolean } | null>(
    null
  );
  const [isAuthReady, setIsAuthReady] = useState(false);

  const tokenFromUrl = getTokenFromUrl();

  const getToken = useCallback(
    (name: string, room: string) => {
      return fetchToken(name, room, tokenFromUrl)
        .then(async res => {
          if (res.ok) {
            return res;
          }
          const json = await res.json();
          const errorMessage = getErrorMessage(json.token);
          throw { message: errorMessage };
        })
        .then(res => res.json())
        .then(res => {
          setOrcanaUser({ apiToken: getTokenFromUrl(), canAdmin: res.canAdmin } as any);
          return res.token as string;
        })
        .catch(err => {
          setError(err);
          return Promise.reject(err);
        });
    },
    [orcanaUser]
  );

  return { orcanaUser, isAuthReady, getToken };
}
