import React, { PropsWithChildren } from 'react';
import { createGlobalStyle } from "styled-components"
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { LayoutDiv, HeaderDiv, ContentDiv, FooterDiv, NavDiv, size } from '../styled/layout';
import SEO, { SeoProps } from './seo';
import theme from '../styled/theme';

export interface BasicProps {
  seo?: SeoProps
  title?: string;
}

const Link: React.FC<{ to: string }> = ({ to, children }) => {
  return <a href={to}>{children}</a>
}

export default (props: PropsWithChildren<BasicProps>) => {
  const { seo } = props;
  const { site: { siteMetadata: { title, since, owner, author } } } = useStaticQuery(query);
  const helmetTitle = props.title ? `${props.title} | ${title}` : title;
  return (
    <>
    <Helmet title={helmetTitle}>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Helmet>
    <GlobalStyle />
    <LayoutDiv>
      <SEO {...seo} />
      <div style={{borderBottom: `1px solid ${theme.lightGray}`}}>
        <HeaderDiv>
          <div>{title}</div>
          <NavDiv>
            <Link to="/">文章</Link>
            <Link to="/about">关于</Link>
          </NavDiv>
        </HeaderDiv>
      </div>
      <ContentDiv>{props.children}</ContentDiv>
      <FooterDiv>
        <div>{`© Copyright ${since} - ${(new Date()).getFullYear()} by ${author}`}</div>
        <div>可通过 <a href={owner} target="_blank">Github</a> 关注我</div>
      </FooterDiv>
    </LayoutDiv>
    </>
  )
}

const GlobalStyle = createGlobalStyle`
html,
body,
#___gatsby,
#gatsby-focus-wrapper {
  height: 100%;
  padding: 0px;
  margin: 0px;
  background-color: #eee;
  color: ${theme.black};
  font-size: 16px;
  font-family: "Verdana", "STXihei";
}

a {
  transition: all 0.3s;
  text-decoration: none;
  font-weight: 400;
  cursor: pointer;
}

a:link, a:visited {
  color: ${theme.primary};
}

a:hover, a:active {
  color: ${theme.black};
}

@media (max-width: ${size.tablet}) {
  html,
  body,
  #___gatsby,
  #gatsby-focus-wrapper {
    font-size: 12px;
  }
}
`;

const query = graphql`
  query config {
    site {
      siteMetadata {
        title
        since
        owner
        author
      }
    }
  }
`;