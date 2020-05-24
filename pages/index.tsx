import React from 'react';
import { getBlogList, getBlogTotal } from '@/common/apis';
import Layout from '@/components/layout';
import ListItem from '@/components/ListItem';
import Pagination, { PaginationProps } from '@/components/pagination';

interface Item {
  title: string;
  number: number;
}

interface ListProps {
  result: Item[];
  pagination: PaginationProps;
  error: boolean;
}

function List(props: ListProps) {
  const { result = [], pagination, error } = props;

  return (
    <Layout error={error}>
      {result.map(item => {
        return (
          <ListItem key={item.number} href="/" text={item.title} />
        )
      })}
      <Pagination {...pagination} />
    </Layout>
  );
}

List.getInitialProps = async (ctx: any) => {
  const { page = 1 } = ctx.query;
  let result: any[] = [];
  let pagination = {
    total: 0,
    page,
    pageSize: 15,
  };
  let error: boolean = false;
  try {
    await getBlogList(pagination.page, pagination.pageSize).then(res => {
      result = res;
    });
    await getBlogTotal().then(res => {
      pagination.total = res.length;
    })
  } catch (ex) {
    console.error(ex);
    error = true;
  }
  return { result, pagination, error } as ListProps;
}

export default List;