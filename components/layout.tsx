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
  error?: boolean;
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

const WrappedError = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 2rem;
`;

const Layout: React.FC<LayoutProps> = props => {
  const { seo = true, title, desc, error = false, children, ...restProps } = props;
  const seoProps = props.seo === true ? {} : props.seo;

  let headTitle = title;
  if (!title) {
    headTitle = websiteConfig.description;
  } else {
    headTitle += ` | ${desc || websiteConfig.description}`;
  }

  return (
    <>
      {seoProps && <SEO {...seoProps} />}
      <Head>
        <title>{headTitle}</title>
      </Head>
      <WrappedLayout>
        <Header />
        <div style={{ flex: 1 }}>
          <div style={{ height: '100%', padding: '2rem' }} className="root" {...restProps}>
            {error ? (
              <WrappedError>Somethins is wrong!</WrappedError>
            ) : children}
          </div>
        </div>
        <Footer />
      </WrappedLayout>
    </>
  )
}

export default Layout;
