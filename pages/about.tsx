import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import Avatar from '@material-ui/core/Avatar';
import Layout from '../components/layout';
import Intro from '../layout/intro';
import logo from '../assets/logo.png';
import Center from '../components/center';

const intro = `
  A developer. Living and working in Shanghai, the current job content is front-end development, and I am still climbing to a bigger and bigger tree.
  
  I need to thank [Kyle Mathews](https://twitter.com/@kylemathews) and [Ahonn](https://github.com/ahonn) here. The theme of the blog is to imitate Kyle Mathews. And ahonn is the senior in my college days, he has given me a lot of help and encouragement, and it is the light for me to move forward.
  
  I hope to communicate and discuss with you. You can find me through [github](https://github.com/Coyeah) or email(Coyeah_chen@outlook.com).
  Life is always full of opportunities and good luck. Conscience clear, head straight.
  God bless you.
`;

const WrappedTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 3rem;
`;

const Page: React.FC = props => {
  return (
    <Layout>
      <Intro>
        <Center>
          <WrappedTitle>Welcome Visit</WrappedTitle>
          <Avatar src={logo} style={{width: '6rem', height: '6rem'}} />
        </Center>
        <Markdown source={intro} />
      </Intro>
    </Layout>
  );
};

export default Page;