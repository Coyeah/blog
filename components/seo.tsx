import React from 'react';
import { NextSeo, NextSeoProps } from 'next-seo';
import config from '../common/website';

const defaultImage = {
  url: `${config.siteUrl}${config.icon}`,
  alt: config.title,
};

export interface SeoProps extends NextSeoProps {
  subTitle?: string;
  image?: string;
}

const SEO: React.FC<SeoProps> = props => {
  const { subTitle, description: desc, canonical, image } = props;
  const title = subTitle ? `${subTitle} - ${config.title}` : config.title;
  const description = desc || config.description;
  const url = canonical || config.siteUrl;
  const ogType = subTitle ? 'article' : 'website';
  const ogImage = image ? { url: image, alt: subTitle } : defaultImage;

  const restProps = {
    title,
    description,
    canonical,
    openGraph: {
      url, title, description, type: ogType, images: [ogImage]
    },
  }

  return (
    <NextSeo {...restProps} />
  );
};

export default SEO;