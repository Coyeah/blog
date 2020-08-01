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
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: `GraphqaCMS`,
        fieldName: 'cms',
        url: 'https://api.github.com/graphql',
        refetchInterval: 60,
        headers: {
          Authorization: `Bearer c95e644cab5e2761ff674d943ee76f328a8b74e2`,
        },
        fetchOptions: {},
      }
    }
  ],
}

// c95e644cab5e2761ff674d943ee76f328a8b74e2