import React from "react"
import styled from 'styled-components';
import Basic from '../layouts/basic';

export const ExceptionDiv = styled.div`
  height: 100%;
  font-size: 3rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &>div {
    margin: 12px 0px;
  }
`;

const BackDiv = styled.div`
  font-size: 1rem;
  font-weight: 300;

  &>a {
    margin-left: 12px;
  }
`;

export default function Home() {
  return (
    <Basic>
      <ExceptionDiv>
        <div>404</div>
        <BackDiv><span>@/"</span><a href="/">回到首页</a></BackDiv>
      </ExceptionDiv>
    </Basic>
  )
}
