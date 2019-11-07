import { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import { github_api_prefix } from './config';

const useWrappedFetch = (request) => (responseFilter) => {
  const [data, setData] = useState(null);
  const [code, setCode] = useState(0);  // 0 - no request; 1 - loading; 2 - done; -1 - error;

  const getData = async (payload) => {
    setCode(1);
    try {
      let data = await request(payload);
      if (typeof responseFilter === 'function') {
        data = responseFilter(data);
      }
      setData(data);
      setCode(2);
      return Promise.resolve(data);
    } catch (ex) {
      setCode(-1);
      return Promise.reject(ex);
    }
  }

  return [{
    data,
    code,
    loading: code === 1
  }, getData, setData];
}


export const getBlogList = useWrappedFetch(async (pageNumber = 1, pageSize = 10) => {
  const res =  await fetch(`https://api.github.com/repos/Coyeah/blog/issues?${github_api_prefix}&page=${pageNumber}&per_page=${pageSize}`);
  const data = await res.json();
  return data;
});

export const getBlogTotal = useWrappedFetch(async () => {
  const res = await fetch(`https://api.github.com/search/issues?q=user:Coyeah+state:open+repo:blog?${github_api_prefix}&page=1&per_page=100`);
  const data = await res.json();
  return data;
});

export const getBlogItem = useWrappedFetch(async (number) => {
  const res = await fetch(`https://api.github.com/repos/Coyeah/blog/issues/${number}?${github_api_prefix}`);
  const data = await res.json();
  return data;
});