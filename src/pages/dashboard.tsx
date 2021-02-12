import React, { useEffect, useState } from 'react';

import { CognitoUser } from '@aws-amplify/auth';
import Amplify, { Auth, API } from 'aws-amplify';
import axios, { Canceler } from 'axios';
import { useRouter } from 'next/router';

import awsExports from '../aws-exports';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

Amplify.configure(awsExports);
interface UserAttributes {
  sub: string;
  email: string;
}

/*
 * The following interface extends the CognitoUser type because it has issues
 * (see github.com/aws-amplify/amplify-js/issues/4927). Eventually (when you
 * no longer get an error accessing a CognitoUser's 'attribute' property) you
 * will be able to use the CognitoUser type instead of CognitoUserExt.
 */
interface CognitoUserExt extends CognitoUser {
  attributes: UserAttributes;
}

export default function Dashboard() {
  const [user, setUser] = useState<CognitoUserExt | null>(null);
  const router = useRouter();
  const [response, setResponse] = useState<string>();
  const [loading, setLoading] = useState(true);
  const apiName = 'proofofconcept';
  const path = '/secretcontent';

  useEffect(() => {
    const getUser = async () => {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();

        setUser(authenticatedUser);
        console.log(authenticatedUser);

        setLoading(true);
        let cancel: Canceler;
        API.get(apiName, path, {
          cancelToken: new axios.CancelToken((c) => {
            cancel = c;
          }),
        })
          .then((res) => {
            setLoading(false);
            setResponse(JSON.stringify(res));
          })
          .catch((error) => {
            setLoading(false);
            console.log('oh no, an error!');
            console.log(error);
            setResponse(JSON.stringify(error));
          });
        return () => {
          cancel();
        };
      } catch {
        router.push('/');
      }
      return true;
    };

    getUser();
  }, []);

  if (user) {
    return (
      <Main meta={<Meta title="Dashboard" description="This is the Dashboard" />}>
        Welcome to your dashboard
        {' '}
        {user.attributes.email}
        <br />
        <br />
        <div>{loading ? 'Loading your data..' : response}</div>
      </Main>
    );
  }
  return null;
}
