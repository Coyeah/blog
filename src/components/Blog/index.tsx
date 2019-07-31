import React, { createContext, useEffect } from 'react';
import useFetch from '@/components/useHooks/useFetch';
import {getBlogList} from '@/services';

export const BlogContext = new createContext();

export const BlogProvider: React.SFC = (props: any) => {
  const [data, getData] = useFetch(getBlogList, (data: object[]) => data.map(v => ({title: v.title, number: v.number})));
  useEffect(() => {
    getData({
      pageNumber: 1,
      pageSize: 100,
    });
  }, []);

  return (
    <BlogContext.Provider value={{data, getData}}>
      {props.children}
    </BlogContext.Provider>
  )
}

export const BlogConsumer = BlogContext.Consumer;
