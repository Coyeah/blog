import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Basic from '../components/basic';
import theme from '../styled/theme';

const ItemDiv = styled.div`
cursor: pointer;
margin-bottom: 3rem;
font-size: 0.8rem;
`;

export const TitleDiv = styled.div`
font-size: 1.4rem;
color: ${theme.primary};
margin-bottom: 1rem;
`;

export const TimeDiv = styled.div`
color: ${theme.gray};
margin-bottom: 1rem;
`;

const ItemHeader: React.FC<ItemHeaderProps> = props => {
  const { title, date, path } = props;
  return (
    <>
      <TitleDiv>{title}</TitleDiv>
      <TimeDiv>{date}</TimeDiv>
    </>
  )
}

export default () => {
  const { allMarkdownRemark: { edges: blogList } } = useStaticQuery(query);
  return (
    <Basic>
      {blogList.map((item: BlogItem) => {
        const { frontmatter, id, excerpt } = item.node;
        return (
          <Link to={frontmatter.path} key={id}>
            <ItemDiv key={id}>
              <ItemHeader key={id} {...frontmatter} />
              <div style={{ color: theme.black}}>{excerpt}</div>
            </ItemDiv>
          </Link>
        )
      })}
    </Basic>
  )
}

const query = graphql`
query Posts {
  allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          path
        }
        id
        excerpt(format: PLAIN, pruneLength: 80)
      }
    }
  }
}
`;

interface ItemHeaderProps {
  title: string;
  date: string;
  path: string;
}

interface BlogItem {
  node: {
    frontmatter: ItemHeaderProps,
    id: string;
    excerpt: string;
  }
}
