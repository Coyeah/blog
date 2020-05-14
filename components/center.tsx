/*
 * @Author: ye.chen
 * @Date: 2020-04-02 17:47:06
 * @Last Modified by: ye.chen
 * @Last Modified time: 2020-04-07 20:20:59
 */
import React from 'react';
import { AlignItemsProperty, JustifyContentProperty } from 'csstype';
import styled from 'styled-components';

export interface CenterProps {
  style?: React.CSSProperties;
  alignItems?: AlignItemsProperty;
  justifyContent?: JustifyContentProperty;

  [name: string]: any;
}

const Wrapped = styled.div`
  width: 100%;
  display: flex;
`;

const Center: React.FC<CenterProps> = (props) => {
  const { alignItems, justifyContent, style, ...restProps } = props;

  return (
    <Wrapped
      style={{
        alignItems: props.alignItems || 'center',
        justifyContent: props.justifyContent || 'space-between',
        ...style,
      }}
      {...restProps}
    >
      {props.children}
    </Wrapped>
  );
};

export default Center;
