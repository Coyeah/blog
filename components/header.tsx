import React from 'react';
import Link from 'next/link';
import styled, { StyledComponent } from 'styled-components';
import websiteConfig from '../common/website';
import { primaryColor, black } from '../common/theme';

const WrappedLayout = styled.div`
  height: 6rem;
  line-height: 6rem;
  display: flex;
  justify-content: space-between;
  align-item: center;

  font-size: 1.6rem;
  font-weight: bold;
`;

const WrappedMenu = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-item: center;

  &>span {
    margin: 0px 1.2rem;
  }
`;

const WrappedSpan: StyledComponent<"span", any, { size?: number }, never> = styled.span`
  font-size: ${props => (props as any).size || '1'}rem;
  font-weight: bold;

  & > a {
    &,
    &:link,
    &:visited {
      color: ${black};
    }

    &:hover,
    &:active {
      color: ${primaryColor};
    }
  }
`;

const Header: React.FC = props => {
  return (
    <div style={{ borderTop: `0.3rem solid ${primaryColor}` }}>
      <WrappedLayout className="root">
        <WrappedSpan size={1.6}><Link href="/" ><a>{websiteConfig.title}</a></Link></WrappedSpan>
        <WrappedMenu>
          <WrappedSpan><Link href="/about" ><a>关于</a></Link></WrappedSpan>
        </WrappedMenu>
      </WrappedLayout>
    </div>
  );
};

export default Header;