import React from 'react';
import styled from 'styled-components';
import { graphql, Link } from 'gatsby';
import { TitleDiv, TimeDiv } from '../pages/index';
import Basic from '../components/basic';
import theme from '../styled/theme';
import styles from './bio.module.less';

export const HrDiv = styled.div`
width: 100%;
border: 1px solid ${theme.lightGray};
margin: 12px 0px;
position: relative;
`;
const PageFooterDiv = styled.div`
display: inline-block;
width: 50%;
`;
const AvatarDiv = styled.div`
  position: absolute;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
  background-image: url('/logos/logo.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-clip: border-box;
`;

const BioTemplate: React.FC<any> = ({ data, pageContext, location }) => {
  const post = data.markdownRemark;
  const { next, previous } = pageContext;
  const { title, date, tag } = post.frontmatter;
  const seo = {
    title,
    article: true,
    pathname: location.pathname,
  }
  return (
    <Basic seo={seo} title={title}>
      <TitleDiv>{title}</TitleDiv>
      <TimeDiv>{date}</TimeDiv>
      {!!tag && <TimeDiv>{tag}</TimeDiv>}
      <HrDiv />
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.html }} />
      <div style={{ marginTop: '4rem' }}>
        <PageFooterDiv style={{ textAlign: 'left' }}>{next && (
          <Link to={`/${next.frontmatter.path}`}>{'\< '}{next.frontmatter.title}</Link>
        )}</PageFooterDiv>
        <PageFooterDiv style={{ textAlign: 'right' }}>{previous && (
          <Link to={`/${previous.frontmatter.path}`}>{previous.frontmatter.title}{' \>'}</Link>
        )}</PageFooterDiv>
      </div>
      <HrDiv>
        <AvatarDiv />
      </HrDiv>
      <div className={styles.name}>coyeah</div>
      <div className={styles.desc}>前端学习路上的小记</div>
    </Basic>
  )
}

export default BioTemplate;

export const pageQuery = graphql`
query PostBySlug($slug: String!) {
  markdownRemark(fields: {slug: {eq: $slug}}) {
    frontmatter {
      title
      date(formatString: "MMMM DD, YYYY")
      tag
    }
    html
    fields {
      slug
    }
  }
}
`;