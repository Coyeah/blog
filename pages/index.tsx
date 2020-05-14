import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import Intro from '../layout/intro';

const Wrapped = styled.div`
  font-size: 1.6rem;
  line-height: 3rem;
`;

const Home: React.FC = props => {
  return (
    <Layout seo={true}>
      <Intro>
        <Wrapped>Welcome to the</Wrapped>
        <Wrapped><b>Personal Internet Domicile</b></Wrapped>
        <Wrapped>of Coyeah</Wrapped>
      </Intro>
    </Layout>
  )
}

export default Home;
