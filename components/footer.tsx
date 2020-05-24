import React from 'react';
import styled from 'styled-components';
import websiteConfig from '../common/website';
import { _primaryColor } from '../common/theme';

const { since, author, owner } = websiteConfig

const Wrapped = styled.div`
  width: 100%;
  border-top: 1px solid ${_primaryColor(0.4)};
  padding: 1rem 1.6rem;
  text-align: center;
  letter-spacing: 1px;
  
  &, & > div {
    font-size: 0.8rem;
    color: #718096 !important;
  }
`;

const Footer: React.FC = props => {
  return (
    <Wrapped>
      <div>{` © ${since} - ${(new Date()).getFullYear()} by ${author}`}</div>
      <div>可通过 <a href={owner} target="_blank">Github</a> 关注我</div>
    </Wrapped>
  );
};

export default Footer;