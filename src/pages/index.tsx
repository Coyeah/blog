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
    <Link to={path}>
      <TitleDiv>{title}</TitleDiv>
      <TimeDiv>{date}</TimeDiv>
    </Link>
  )
}

export default () => {
  const { allMarkdownRemark: { edges: blogList } } = useStaticQuery(query);
  return (
    <Basic>
      {blogList.map((item: BlogItem) => {
        const { frontmatter, id, excerpt } = item.node;
        return (
          <ItemDiv key={id}>
            <ItemHeader key={id} {...frontmatter} />
            <div>{excerpt}</div>
          </ItemDiv>
        )
      })}
    </Basic>
  )
}

const query = graphql`
query blogList {
  allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          path
        }
        id
        excerpt(format: PLAIN)
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
