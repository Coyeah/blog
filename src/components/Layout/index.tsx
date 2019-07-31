import React from 'react';
import Header from './Header';
import history from '@/utils/history';
import { BlogProvider } from '@/components/Blog';
import './index.less';

const BasicLayout = (props: any) => {
  const {location: {pathname}} = history,
    cx = `layout ${pathname !== '/' ? 'layout-reversal' : ''}`;
  const cxPost = pathname.indexOf('post') < 0 ? '' : 'layout-content-post';
  
  return (
    <BlogProvider>
      <div className={cx}>
        <Header />
        <div className={`layout-content ${cxPost}`}>{props.children}</div>
      </div>
    </BlogProvider>
  )
}

export default BasicLayout;