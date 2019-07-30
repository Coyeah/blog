import React from 'react';

const style = {
  textAlign: 'center',
  fontSize: '1.6rem',
  minHeight: '80vh',
};

const Loadable = (props: any) => {
  const {children, loading, ...restProps} = props;
  if (!children || loading) return (
    <div style={style} {...restProps}>Loading...</div>
  );
  
  return (
    <>{children}</>
  )
}

export default Loadable;