import React from 'react';
import { Helmet } from 'react-helmet';

const Facebook: React.FC<FacebookProps> = props => {
  const {
    title,
    desc,
    image,
    url,
    locale,
    type = 'website',
    name = null,
  } = props;

  return (
    <Helmet>
      {name && <meta property="og:site_name" content={name} />}
      <meta property="og:locale" content={locale} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={desc} />
    </Helmet>
  )
}

export default Facebook;

export interface FacebookProps {
  title: string;
  desc: string;
  image: string;
  url: string;
  locale: string;
  type?: string;
  name?: string;
}