import React from 'react';

import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

const Dashboard = () => (
  <Main meta={<Meta title="Dashboard" description="This is the Dashboard" />}>
    This is the Dashboard, you can only see it if you&apos;re logged in
  </Main>
);

export default Dashboard;
