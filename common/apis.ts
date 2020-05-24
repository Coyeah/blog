import request from '../utils/request';
import { github_api_prefix } from './github.config';

export const getBlogList = (pageNum = 1, pageSize = 10) => {
  return request
    .get(`https://api.github.com/repos/Coyeah/blog/issues?${github_api_prefix}&page=${pageNum}&per_page=${pageSize}`)
    .then((response: any) => {
      return response.json();
    });
}

export const getBlogTotal = () => {
  return request
    .get(`https://api.github.com/repos/Coyeah/blog/issues?${github_api_prefix}&page=1&per_page=100`)
    .then((response: any) => {
      return response.json();
    });
}


export const getBlogItem = (number: number) => {
  return request
    .get(`https://api.github.com/repos/Coyeah/blog/issues/${number}?${github_api_prefix}`)
    .then((response: any) => {
      return response.json();
    });
};