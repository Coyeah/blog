import React from 'react';
import styles from './index.module.less';

const Loadable = (props: any) => {
  const {children, loading, text, ...restProps} = props;
  if (!children || loading) return (
    <div className={styles.layout} {...restProps}>
      <div className={styles.block} />
      {!!text && (
        <p>{text}</p>
      )}
    </div>
  );
  
  return (
    <>{children}</>
  )
}

export default Loadable;