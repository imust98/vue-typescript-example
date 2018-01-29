import { IFetchRequest } from '../interfaces/index';
export const articlelist: IFetchRequest = {
  url: '/api/list',
  method: 'GET',
  cache: true
};
