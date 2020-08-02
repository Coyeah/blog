const path = require('path');
const {
  createFilePath
} = require(`gatsby-source-filesystem`);

const query = `
query posts {
  allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          date
          path
        }
        id
        fields {
          slug
        }
      }
    }
  }
}
`;

exports.createPages = async ({
  graphql,
  actions
}) => {
  const {
    createPage
  } = actions;
  const bio = path.resolve(`./src/templates/bio.tsx`);
  const result = await graphql(query);
  if (result.errors) {
    throw result.errors
  }
  const posts = result.data.allMarkdownRemark.edges;
  posts.map((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    createPage({
      path: post.node.frontmatter.path,
      component: bio,
      context: {
        previous,
        next,
        slug: post.node.fields.slug,
      }
    });
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}