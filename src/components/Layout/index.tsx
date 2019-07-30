import React from 'react';
import Header from './Header';
import history from '@/utils/history';
import './index.less';

const BasicLayout = (props: any) => {
  const {location: {pathname}} = history,
    cx = `layout ${pathname !== '/' ? 'layout-reversal' : ''}`;
  // const cxContent = (pathname !== '/' || pathname.indexOf('post') < 0) && 'layout-content';
  
  return (
    <div className={cx}>
      <Header />
      <div className="layout-content">{props.children}</div>
    </div>
  )
}

export default BasicLayout;