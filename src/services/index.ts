/* eslint-disable */
import request from '@/utils/request';
import {github_api_prefix} from '@/config';

export interface IBlogObject {
  pageNumber?: number;
  pageSize?: number;
  number?: number;
}

export const getBlogList = (payload: IBlogObject = {}) => {
  const {pageNumber = 1, pageSize = 10} = payload;
  return request
    .get(`https://api.github.com/repos/Coyeah/blog/issues?${github_api_prefix}&page=${pageNumber}&per_page=${pageSize}`)
    .then((res: any) => res.json());
}

export const getBlogItem = (payload: IBlogObject = {}) => {
  const {number} = payload;
  return request
    .get(`https://api.github.com/repos/Coyeah/blog/issues/${number}?${github_api_prefix}`)
    .then((res: any) => res.json());
}

export const getBlogTotal = () => {
  return request
    .get(`https://api.github.com/search/issues?q=user:Coyeah+state:open+repo:blog?${github_api_prefix}`)
    .then((res: any) => res.json());
}
