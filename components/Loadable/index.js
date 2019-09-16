import * as React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const text = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];

const Loadable = ({ loading, children }) => {
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (key > text.length + 2) {
        setKey(0);
      } else {
        setKey(key + 1);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [key]);
  if (typeof loading === 'undefined' || loading === true) {
    return (
      <div className={styles.layout}>
        {text.map((value, index) => (
          <span key={index} className={classNames({ [styles.focus]: index === key })}>{value}</span>
        ))}
      </div>
    )
  }
  return (
    <>
      {children}
    </>
  )
};

export default Loadable;