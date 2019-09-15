import React from 'react'
import Layout from '../components/Layout';
import styles from './index.less';

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render() {
    const { statusCode } = this.props;
    return (
      <Layout>
        <div className={styles.layout}>
          <div className={styles.text} style={{fontSize: '1.6rem', textAlign: 'center'}}>
              {statusCode} | {
                this.props.statusCode
                  ? `An error ${this.props.statusCode} occurred on server`
                  : 'An error occurred on client'
              }
          </div>
          <div className={styles.block} />
        </div>
      </Layout>
    )
  }
}

export default Error