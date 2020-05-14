import React from 'react';
import Head from 'next/head';
import websiteConfig from '../common/website';
import Footer from './footer';
import SEO, { SeoProps } from './seo';
import Header from './header';
import styled from 'styled-components';

export interface LayoutProps {
  seo?: SeoProps | boolean;
  title?: string;
  desc?: string;

  [name: string]: any;
}

const WrappedLayout = styled.div`
  height: 100%;
  display: flex;
  justify-items: center;
  align-items: flex-start;
  flex-direction: column;

  & > div {
    width: 100%;
  }
`;

const WrappedContent = styled.div`
  flex: 1;
`;

const Layout: React.FC<LayoutProps> = props => {
  const { seo, title = websiteConfig.description, desc, ...restProps } = props;
  const seoProps = props.seo === true ? {} : props.seo;

  let headTitle = title;
  if (desc) {
    headTitle += ` | ${desc}`;
  }

  return (
    <>
      {seoProps && <SEO {...seoProps} />}
      <Head>
        <title>{headTitle}</title>
      </Head>
      <WrappedLayout>
        <Header />
        <WrappedContent>
          <div style={{ height: '100%' }} {...restProps}>{props.children}</div>
        </WrappedContent>
        <Footer />
      </WrappedLayout>
    </>
  )
}

export default Layout;
