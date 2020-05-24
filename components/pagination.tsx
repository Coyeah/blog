import React from 'react';
import Link from 'next/link';
import Center from './center';

export interface PaginationProps {
  pageSize?: number;
  page?: number,
  total?: number,
}

const Pagination: React.FC<PaginationProps> = props => {

  console.log(props);

  if (!props.total) return <>{props.children}</>;

  const pageSize = Number(props.pageSize) || 15,
    page = Number(props.page) || 1,
    total = Number(props.total);

  return (
    <Center>
      <div>
        {page !== 1 && (
          <Link href={{ pathname: '/', query: { page: page - 1 } }}><a>上一页</a></Link>
        )}
      </div>
      <div>
        {Math.ceil(total / pageSize) > page && (
          <Link href={{ pathname: '/', query: { page: page + 1 } }}><a>下一页</a></Link>
        )}
      </div>
    </Center>
  )
}

export default Pagination;

