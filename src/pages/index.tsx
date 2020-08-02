import React from "react"
import { useStaticQuery, graphql } from 'gatsby';
import Basic from '../layouts/basic';

export default () => {
  const { allMarkdownRemark: { edges: blogList } } = useStaticQuery(query);
  return (
    <Basic>
      {(blogList as BlogList).map(item => {
        const { frontmatter: { title, date, tag }, id } = item.node;
        return (
          <p key={id}>{title} - {date}</p>
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
            date
            tag
          }
        }
      }
    }
  }
`;

interface BlogItem {
  node: {
    frontmatter: {
      title: string;
      date: string;
      tag?: string;
    },
    id: string;
  }
}

type BlogList = Array<BlogItem>;