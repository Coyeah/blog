import React from 'react';
import { env } from '@/env';
import { Link } from 'react-router-dom';


const Header: React.SFC = (props: any) => (
  <div className="layout-header">
    <div className="main">
      <Link to='/'>{`coyeah`}</Link>
    </div>
    <div className="sub">
      <Link to='/archives'>{`blog`}</Link>
      <span>, </span>
      <Link to='/about'>{`about`}</Link>
    </div>
  </div>
);

export default Header;