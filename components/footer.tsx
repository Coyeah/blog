import React from 'react';
import styled from 'styled-components';
import Center from './center';
import websiteConfig from '../common/website';
import { primaryColor } from '../common/theme';

const { since, author, owner } = websiteConfig

const Wrapped = styled.div`
  border-bottom: 0.3rem solid ${primaryColor};
`;

const Footer: React.FC = props => {
  return (
    <Center justifyContent="center">
      <Wrapped>
        <a href={owner} target="_blank">Github</a>
        <span>{` © ${since} - ${(new Date()).getFullYear()} ${author}`}</span>
      </Wrapped>
    </Center>
  );
};

export default Footer;