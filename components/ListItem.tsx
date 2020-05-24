import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { gray } from '@/common/theme';
import Center from './center';
import Link from 'next/link';

const width = 0.3;
const WrappedDot = styled.div`
  display: inline-block;
  width: ${width}rem;
  min-width: ${width}rem;
  max-width: ${width}rem;
  height: 1.2rem;
  border-radius: 10px;
  margin-right: 1.2rem;
  background-color: ${gray};
`;

const WrappedText = styled.div`
  line-height: 1.4rem;
`;

const layoutStyle: CSSProperties = {
  marginBottom: '1.6rem',
  cursor: 'pointer',
};

interface ListItemProps {
  href: string;
  text: string;
}

export default function (props: ListItemProps) {
  const { href = '/', text } = props;

  return (
    <Center justifyContent='flex-start' alignItems='flex-start' style={layoutStyle}>
      <WrappedDot />
      <WrappedText>
        <Link href={href}><a>{text}</a></Link>
      </WrappedText>
    </Center>
  )
}