import React, { useState, useCallback } from 'react';
var AV = require('leancloud-storage');
import { storage, generateUUID } from './helper';
import { leancloud_api } from '../apis/config';
let isInit = false;

const init = () => {
  if (isInit) return;
  AV.init(leancloud_api);
  isInit = true;
}

export const visitor = (id) => {
  id = !id ? storage('visitor') : id;
  if (!id) {
    id = generateUUID();
    storage('visitor', id);
  }
  init();
  new Promise((resolve, reject) => {
    let query = new AV.Query('Visitor');
    query.contains('name', id);
    query.first().then(data => {
      resolve(data);
    }, error => {
      reject(error);
    });
  }).then(data => {
    if (!data) {
      let Visitor = AV.Object.extend('Visitor');
      let user = new Visitor();
      user.set('name', id);
      user.save();
    } else if (Math.abs((new Date()).getTime() - new Date(data.updatedAt).getTime()) < 1800000) {
    } else {
      let user = AV.Object.createWithoutData('Visitor', data.id);
      user.set('times', data._serverData.times + 1);
      user.save();
    }
  });
}

export const reader = (route, title) => {
  if (!route || !title) return;
  init();
  new Promise((resolve, reject) => {
    let query = new AV.Query('Reader');
    query.contains('title', title);
    query.first().then(data => {
      resolve(data);
    }, error => {
      reject(error);
    });
  }).then(data => {
    if (!data) {
      const Reader = AV.Object.extend('Reader');
      const record = new Reader();
      record.set('url', route);
      record.set('title', title);
      record.save();
    } else if (Math.abs((new Date()).getTime() - new Date(data.updatedAt).getTime()) < 600000) {
    } else {
      const record = AV.Object.createWithoutData('Reader', data.id);
      record.set('times', data._serverData.times + 1);
      record.save();
    }
  })
}

export const useReader = () => {
  const [number, setNumber] = useState('*')
  const getNumber = useCallback((title) => {
    if (!title) return;
    init();
    setTimeout(() => {
      new Promise((resolve, reject) => {
        const query = new AV.Query('Reader');
        query.contains('title', title);
        query.first().then(data => {
          resolve(data);
        }, error => {
          reject(error);
        }); 
      }).then(data => {
        if (!data) {
          setNumber(1);
        } else {
          setNumber(data.toJSON().times);
        }
      });
    }, 0);
  }, []);
  return [number, getNumber];
}