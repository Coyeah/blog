import React, {lazy, ComponentType} from 'react';
import { Route } from 'react-router-dom';

export type TLazyComponent = () => Promise<{default: ComponentType}>;

const LazyRoute: React.SFC = (props: any) => {
  const { component, ...restProps } = props;
  const LazyComponent = lazy(component);

  return (
    <Route {...restProps} component={() => <LazyComponent {...props} />} />
  )
}

export default LazyRoute;