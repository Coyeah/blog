import React from 'react';
import Basic from '../components/basic';
import { useStaticQuery, graphql } from 'gatsby';
import styles from '../templates/bio.module.less';

export default () => {
  const { markdownRemark: { html } } = useStaticQuery(query);

  return (
    <Basic>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
    </Basic>
  )
}

const query = graphql`
query About {
  markdownRemark(fileAbsolutePath: {regex: "/content\\/about\\/index.md/"}) {
    html
  }
}
`;