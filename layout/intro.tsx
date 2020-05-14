import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';


const WrappedLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const WrappedContent = styled.div`
  width: 50%;
  padding-bottom: 5rem;

  @media (max-width: 768px) {
    width: 90%;
    margin: auto;
  }
`;

const paperStyle: CSSProperties = {
  padding: '4rem 2rem',
}

const Intro: React.FC = props => {
  return (
    <WrappedLayout>
      <WrappedContent>
        <Paper style={paperStyle} elevation={8} square >
          {props.children}
        </Paper>
      </WrappedContent>
    </WrappedLayout>
  );
};

export default Intro;