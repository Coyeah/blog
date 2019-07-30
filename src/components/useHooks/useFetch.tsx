import React, { useState } from 'react';
import request from '@/utils/request';

interface IFinale {
  onResolve?: TFunction;
  onReject?: TFunction;
}
interface IInitReq {
  url: string;
  method: string;
}

type TFunction = (param?: any) => any | void;

type TInitReq = IInitReq | TFunction | string;

const OWN_REQUEST = Symbol('OWN_REQUEST'),
  FUNC_REQUEST = Symbol('FUNC_REQUEST');
const codeMsg = {
  '0': 'unRequest',
  '1': 'loading',
  '2': 'done',
  '-1': 'error'
};
const emptyFunc = () => {};
const equip = (url: string , payload: object | string) => {
  let params = typeof payload === 'string' ? payload : '';
  if (typeof payload === 'object') {
    Object.keys(payload).forEach(value => {
      params += `${value}=${payload[value]}&`;
    });
    params = params.slice(0, -1);
  }
  if (url.indexOf('?') > -1) {
    return `${url}&${params}`;
  }
  return `${url}?${params}`;
}

const useFetch = (initReq: TInitReq, responseFilter: (data: object) => object = data => data, finale: IFinale = {}) => {
  const [data, setData] = useState(void(0));
  const [code, setCode] = useState(0);

  let url = '', method = 'get', _typeof = OWN_REQUEST, initReqFunc: TFunction;
  switch(typeof initReq) {
    case 'string':
      url = initReq;
      break; 
    case 'object': 
      url = initReq.url;
      method = initReq.url;
      break; 
    case 'function':
      _typeof = FUNC_REQUEST;
      initReqFunc = initReq;
      break; 
    default:
      console.error('"useFetch": You need to pass in a parameter to initialize your request.');
      break; 
  }
  const {onResolve: _onResolve, onReject: _onReject } = finale;

  const getData = (payload?: object | string, onResolve?: TFunction, onReject?: TFunction) => {
    onResolve = onResolve || _onResolve || emptyFunc;
    onReject = onReject || _onReject || emptyFunc;
    let res: any;
    setCode(1);
    if (_typeof == OWN_REQUEST) {
      if (method === 'get') {
        url = equip(url, payload);
        payload = {};
      }
      payload = typeof payload === 'object' ? payload : { data: payload };
      res = request[method](url, {...payload})
        .then((res: Response) => res.json());
    } else if (_typeof == FUNC_REQUEST) {
      res = initReqFunc(payload);
    } else {
      onReject();
      console.error('"useFetch": An exception occurred in type determination.');
      setCode(-1);
    }
    res.then((data: object) => {
      const filterData = responseFilter(data);
      onResolve(filterData);
      setData(filterData);
      setCode(2);
    }).catch((err: object) => {
      onReject(err);
      console.error(err);
      setCode(-1);
    });
  }

  return [
    {
      data,
      status : {
        code,
        loading: code === 1,
        msg: codeMsg[code],
        t: Date.now()
      }
    },
    getData
  ];
}

export default useFetch;