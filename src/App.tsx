import React, {
  Suspense, useEffect
} from 'react';
import { Router, withRouter, Switch } from 'react-router-dom';
import LazyRoute from '@/components/LazyRoute';
import Layout from '@/components/Layout';
import Loadable from '@/components/Loadable';
import { routeConfig } from './config';
import { visitor } from '@/utils/leancloud';

const LayoutRoute = withRouter((props: object) => {
  useEffect(() => {
    visitor();
  }, []);
  return (
    <Layout>
      <Suspense fallback={<Loadable />}>
        <Switch>
          {routeConfig.map(value => (
            <LazyRoute key={value.path} {...value}/>
          ))}
        </Switch>
      </Suspense>
    </Layout>
  )
});
  

const App: React.SFC = ({history} : any) => (
  <Router history={history}>
    <LayoutRoute />
  </Router>
)

export default App;