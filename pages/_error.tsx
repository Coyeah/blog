import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';

const Wrapped = styled.div`
  font-size: 1.4rem;
  line-height: 3rem;
`;

interface MyErrorProps {
  statusCode: number;
}

class MyError extends React.PureComponent<MyErrorProps> {
  static getInitialProps({ res, err }: any) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render() {
    const { statusCode } = this.props;
    return (
      <Layout>
        <Wrapped>
          {statusCode && (<div><b>{statusCode}</b></div>)}
          <div>{
            statusCode
              ? `An error ${statusCode} occurred on server`
              : 'An error occurred on client'
          }</div>
        </Wrapped>
      </Layout>
    )
  }
}

export default MyError;