import { leancloud_api } from '@/config';
import { storage, generateUUID } from '@/utils';

AV.init(leancloud_api.appId, leancloud_api.appKey);

const recorder = (id: string = '') => {
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



export default recorder;