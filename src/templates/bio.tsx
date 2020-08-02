import React from 'react';
import { graphql } from 'gatsby';
import { TitleDiv, TimeDiv } from '../pages/index';
import Basic from '../components/basic';

const BioTemplate: React.FC<any> = ({ data, pageContext, location }) => {
  const post = data.markdownRemark;
  const { title, date } = post.frontmatter;
  const seo = {
    title,
    article: true,
    pathname: location.pathname,
  }
  return (
    <Basic seo={seo}>
      <TitleDiv>{title}</TitleDiv>
      <TimeDiv>{date}</TimeDiv>
      <div dangerouslySetInnerHTML={{__html: post.html}} />
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