import React from 'react';
import Link from 'next/link';
import styled, { StyledComponent } from 'styled-components';
import Button from '@material-ui/core/Button';
import websiteConfig from '../common/website';
import { primaryColor, white } from '../common/theme';

const WrappedLayout = styled.div`
  border-top: 0.3rem solid ${primaryColor};
  height: 6rem;
  padding: 0px 1rem;
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
`;

const WrappedSpan: StyledComponent<"span", any, { size?: number }, never> = styled.span`
  font-size: ${props => (props as any).size || '1'}rem;
  font-weight: bold;
`;

const Header: React.FC = props => {

  return (
    <WrappedLayout>
      <Link href="/" prefetch>
        <Button size="large"><WrappedSpan size={1.6}>{websiteConfig.title}</WrappedSpan></Button>
      </Link>
      <WrappedMenu>
        <Link href="/list" prefetch><Button><WrappedSpan>博文</WrappedSpan></Button></Link>
        <Link href="/about" prefetch><Button><WrappedSpan>关于</WrappedSpan></Button></Link>
      </WrappedMenu>
    </WrappedLayout>
  );
};

export default Header;