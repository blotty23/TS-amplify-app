import React, { useState, useEffect } from 'react';

import Auth, { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import Amplify from 'aws-amplify';

import awsExports from '../aws-exports';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

Amplify.configure(awsExports);

if (process.env.ENVIRONMENT === 'dev') {
  awsExports.oauth.redirectSignIn = process.env.REDIRECT_SIGN_IN;
  awsExports.oauth.redirectSignOut = process.env.REDIRECT_SIGN_OUT;
}

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        setUser(authenticatedUser);
      } catch {
        setUser(null);
      }
    };

    getUser();
  }, []);
  return (
    <Main meta={<Meta title="Hello" description="This is the landing page" />}>
      This is the landing page
      {' '}
      <br />
      <br />
      {user ? (
        <button type="button" onClick={() => Auth.signOut()}>
          Log out
        </button>
      ) : (
        <button
          type="button"
          onClick={() => Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
          })}
        >
          Click here to log into Google
        </button>
      )}
    </Main>
  );
}

export default Home;
