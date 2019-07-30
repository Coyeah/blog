// single-ts

if (process.env.NODE_ENV === 'development' && ENV_MOCK) {
  // require('../mock/example.js');
}

import React from 'react';
import {render} from 'react-dom';
import './index.less';
import App from './App';
import history from '@/utils/history';

render(
  <App history={history} />,
  document.getElementById('root')
);
