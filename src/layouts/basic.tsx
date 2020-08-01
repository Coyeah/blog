import React, { PropsWithChildren } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { LayoutDiv, HeaderDiv, ContentDiv, FooterDiv, NavDiv } from '../styled/layout';
import SEO, { SeoProps } from '../components/seo';
import '../styles/global.css';

export interface BasicProps {
  seo?: SeoProps
}

const Link: React.FC<{ to: string }> = ({ to, children }) => {
  return <a href={to}>{children}</a>
}

export default (props: PropsWithChildren<BasicProps>) => {
  const { seo } = props;
  const { site: { siteMetadata: { title, since, owner, author } } } = useStaticQuery(query);
  return (
    <LayoutDiv>
      <SEO {...seo} />
      <HeaderDiv>
        <div>{title}</div>
        <NavDiv>
          <Link to="/">文章</Link>
          <Link to="/about">关于</Link>
        </NavDiv>
      </HeaderDiv>
      <ContentDiv>{props.children}</ContentDiv>
      <FooterDiv>
        <div>{`© Copyright ${since} - ${(new Date()).getFullYear()} by ${author}`}</div>
        <div>可通过 <a href={owner} target="_blank">Github</a> 关注我</div>
      </FooterDiv>
    </LayoutDiv>
  )
}

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