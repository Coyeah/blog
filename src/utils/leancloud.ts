import React, { useState, useCallback } from 'react';
import { leancloud_api } from '@/config';
import { storage, generateUUID } from '@/utils';

AV.init(leancloud_api.appId, leancloud_api.appKey);

export const visitor = (id: string = '') => {
  id = !id ? storage('visitor') : id;
  if (!id) {
    id = generateUUID();
    storage('visitor', id);
  }
  new Promise((resolve, reject) => {
    let query = new AV.Query('Visitor');
    query.contains('name', id);
    query.first().then((data: any) => {
      resolve(data);
    }, (error: any) => {
      reject(error);
    });
  }).then((data: any) => {
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

export const reader = (route: string, title: string) => {
  if (!route || !title) return;
  new Promise((resolve, reject) => {
    let query = new AV.Query('Reader');
    query.contains('title', title);
    query.first().then((data: any) => {
      resolve(data);
    }, (error: any) => {
      reject(error);
    });
  }).then((data: any) => {
    if (!data) {
      let Reader = AV.Object.extend('Reader');
      let record = new Reader();
      record.set('route', route);
      record.set('title', title);
      record.save();
    } else if (Math.abs((new Date()).getTime() - new Date(data.updatedAt).getTime()) < 600000) {
    } else {
      let record = AV.Object.createWithoutData('Reader', data.id);
      record.set('times', data._serverData.times + 1);
      record.save();
    }
  });
}

export const useReader = () => {
  const [number, setNumber] = useState(`-`);
  const getNumber = useCallback((title: string) => {
    if (!title) return;
    setTimeout(() => {
      new Promise((resolve, reject) => {
        let query = new AV.Query('Reader');
        query.contains('title', title);
        query.first().then((data: any) => {
          resolve(data);
        }, (error: any) => {
          reject(error);
        });
      }).then((data: any) => {
        if (!!data) {
          setNumber(data.toJSON().times);
        }
      });
    }, 3000);

  }, []);

  return [number, getNumber];
} 