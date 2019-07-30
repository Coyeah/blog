import React, {
  Suspense
} from 'react';
import { Router, withRouter, Route, Switch, Redirect } from 'react-router-dom';
import LazyRoute from '@/components/LazyRoute';
import Layout from '@/components/Layout';
import Loadable from '@/components/Loadable';
import {routeConfig} from './config';

const LayoutRoute = withRouter((props: object) => (
  <Layout>
    <Suspense fallback={<Loadable />}>
      <Switch>
        {routeConfig.map(value => (
          <LazyRoute key={value.path} {...value}/>
        ))}
      </Switch>
    </Suspense>
  </Layout>
));

const App: React.SFC = ({history} : any) => (
  <Router history={history}>
    <LayoutRoute />
  </Router>
)

export default App;