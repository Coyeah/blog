const website = require('./config/website');

const pathPrefix = website.pathPrefix === '/' ? '' : website.pathPrefix;

module.exports = {
  siteMetadata: {
    siteUrl: website.url + pathPrefix,
    pathPrefix,
    title: website.title,
    description: website.description,
    banner: website.logo,
    siteLanguage: website.siteLanguage,
    ogLanguage: website.ogLanguage,
    author: website.author,
    twitter: website.twitter,
    facebook: website.facebook,

    owner: "https://github.com/Coyeah",
    since: 2018,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
        excerpt_separator: `<!-- endexcerpt -->`,
      },
    },
    'gatsby-transformer-remark'
  ],
}
