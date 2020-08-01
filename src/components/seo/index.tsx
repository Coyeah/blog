import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import Facebook from './Facebook';
import Twitter from './Twitter';

const SEO: React.FC<SeoProps> = props => {
  const { node = {} } = props;
  const { site: { siteMetadata, buildTime } } = useStaticQuery(query);
  const { 
    title,
    description,
    siteUrl,
    banner,
    siteLanguage,
    ogLanguage,
    author,
    twitter,
    facebook
  } = siteMetadata;
  const seo = {
    title: props.title || title,
    description: props.desc || description,
    image: `${siteUrl}${banner || props.banner}`,
    url: `${siteUrl}${props.pathname || ''}`
  };

  const schemaOrgWebPage = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    url: siteUrl,
    inLanguage: siteLanguage,
    mainEntityOfPage: siteUrl,
    description: description,
    name: title,
    author: {
      '@type': 'Person',
      name: author,
    },
    copyrightHolder: {
      '@type': 'Person',
      name: author,
    },
    copyrightYear: '2018',
    creator: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: author,
    },
    datePublished: '2018-01-01T10:30:00+01:00',
    dateModified: buildTime,
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}${banner}`,
    },
  };

  let itemListElement = [
    {
      '@type': 'ListItem',
      item: {
        '@id': siteUrl,
        name: 'Homepage',
      },
      position: 1,
    },
  ];
  let schemaArticle = null;

  if (props.article) {
    schemaArticle = {
      '@context': 'http://schema.org',
      '@type': 'Article',
      author: {
        '@type': 'Person',
        name: author,
      },
      copyrightHolder: {
        '@type': 'Person',
        name: author,
      },
      copyrightYear: '2019',
      creator: {
        '@type': 'Person',
        name: author,
      },
      publisher: {
        '@type': 'Organization',
        name: author,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}${banner}`,
        },
      },
      datePublished: node.first_publication_date,
      dateModified: node.last_publication_date,
      description: seo.description,
      headline: seo.title,
      inLanguage: siteLanguage,
      url: seo.url,
      name: seo.title,
      image: {
        '@type': 'ImageObject',
        url: seo.image,
      },
      mainEntityOfPage: seo.url,
    }
    // Push current blogpost into breadcrumb list
    itemListElement.push({
      '@type': 'ListItem',
      item: {
        '@id': seo.url,
        name: seo.title,
      },
      position: 2,
    })
  }
  
  const breadcrumb = {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    description: 'Breadcrumbs list',
    name: 'Breadcrumbs',
    itemListElement,
  };

  return (
    <>
      <Helmet title={seo.title}>
        <html lang={siteLanguage} />
        <meta name="description" content={seo.description} />
        <meta name="image" content={seo.image} />
        <link rel="shortcut icon" href="/favicon.ico" />
        {props.article ? (
          <script type="application/ld+json">{JSON.stringify(schemaArticle)}</script>
        ) : (
          <script type="application/ld+json">{JSON.stringify(schemaOrgWebPage)}</script>
        )}
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        {/* <style media="screen">{globalStyle}</style> */}
      </Helmet>
      <Facebook
        desc={seo.description}
        image={seo.image}
        title={seo.title}
        type={props.article ? 'article' : 'website'}
        url={seo.url}
        locale={ogLanguage}
        name={facebook}
      />
      <Twitter title={seo.title} image={seo.image} desc={seo.description} username={twitter} />
    </>
  )
}

export {
  Facebook,
  Twitter,
  SEO
};

export default SEO;

export interface SeoProps {
  title?: string,
  desc?: string,
  banner?: string,
  pathname?: string,
  article?: boolean,
  node?: {
    first_publication_date?: string;
    last_publication_date?: string;
  },
};

const query = graphql`
  query SEO {
    site {
      buildTime(formatString: "YYYY-MM-DD")
      siteMetadata {
        siteUrl
        title
        description
        banner
        siteLanguage
        ogLanguage
        author
        twitter
        facebook
      }
    }
  }
`;