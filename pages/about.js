import * as React from 'react';
import Markdown from 'react-markdown';
import Layout from '../components/Layout';
import logo from '../public/logo.svg';
import styles from './about.less';

const image = {backgroundImage: `url(${logo})`};
const intro = `
  A developer. Living and working in Shanghai, the current job content is front-end development, and I am still climbing to a bigger and bigger tree.
  
  I need to thank [Kyle Mathews](https://twitter.com/@kylemathews) and [Ahonn](https://github.com/ahonn) here. The theme of the blog is to imitate Kyle Mathews. And ahonn is the senior in my college days, he has given me a lot of help and encouragement, and it is the light for me to move forward.
  
  I hope to communicate and discuss with you. You can find me through [github](https://github.com/Coyeah) or email(Coyeah_chen@outlook.com).

  Life is always full of opportunities and good luck. Conscience clear, head straight.

  God bless you.
`;

export default function About() {

  return (
    <Layout isLight title="about">
      <h1>Welcome Visit</h1>
      <div className="avatar" style={image} />
      {/* <div className={styles.avatar} style={image} /> */}
      <Markdown source={intro} />
    </Layout>
  )
}