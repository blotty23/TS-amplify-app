import React from 'react';

import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

const Index = () => (
  <Main meta={<Meta title="Hello" description="This is the landing page" />}>
    This is the landing page
  </Main>
);

export default Index;
