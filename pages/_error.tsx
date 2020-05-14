import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import Intro from '../layout/intro';

const Wrapped = styled.div`
  font-size: 1.8rem;
  line-height: 3rem;
`;

interface MyErrorProps {
  statusCode: number;
}

class MyError extends React.PureComponent<MyErrorProps> {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render() {
    const { statusCode } = this.props;
    return (
      <Layout seo={true}>
        <Intro>
          <Wrapped>
            {statusCode && (<div><b>{statusCode}</b></div>)}
            <div>{
              this.props.statusCode
                ? `An error ${this.props.statusCode} occurred on server`
                : 'An error occurred on client'
            }</div>
          </Wrapped>
        </Intro>
      </Layout>
    )
  }
}

export default MyError;