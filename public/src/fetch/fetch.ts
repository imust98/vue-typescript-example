import { Store } from 'vuex';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import isPlainObject from 'lodash/isPlainObject';
import { IFetchRequest, IFetchInit } from './interfaces';
import { compile } from 'path-to-regexp';
import { stringify } from 'query-string';

/**
 * vuex store
 */
let store: Store<any>;

/**
 * fetch cache
 */
const lcache: Map<string, any> = new Map();

/**
 * fetch install
 * @param store vuex store
 */
export function install(initStore: Store<any>): void {
  if (store) {
    return;
  }

  store = initStore;
}

/**
 * default RequestInit
 */
const defaultInit = {
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * fetch timeout
 */
const defaultTimeout: number = 10 * 1000;
function fetchTimeout(time: number = defaultTimeout): Promise<Response> {
  const response = new Response(
    JSON.stringify({
      code: 408,
      msg: '超时，请稍后再试',
      result: null
    })
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(response);
    }, time);
  });
}

/**
 * 处理 fetch 参数
 */
export function fetchParamParser(
  config: IFetchRequest,
  init?: IFetchInit
): [string, IFetchInit] {
  let { url, method } = config;
  // 不修改输入的原对象
  init = cloneDeep(init);

  // 解析 url
  if (url.includes(':') && init && init.params) {
    let path;
    let queryStirng;

    // 处理 query string 和 path-to-regexp 的冲突
    if (url.includes('?')) {
      [path, queryStirng] = url.split('?');
    } else {
      path = url;
      queryStirng = '';
    }

    url = compile(path)(init.params);

    if (queryStirng) {
      url = `${url}?${queryStirng}`;
    }
  }

  // query string
  if (['GET', 'DELETE'].includes(method) && init && init.body) {
    const query = stringify(init.body);

    url = url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
  }

  // stringify body
  if (
    !['GET', 'DELETE'].includes(method) &&
    init &&
    init.body &&
    isPlainObject(init.body)
  ) {
    init.body = JSON.stringify(init.body);
  }

  // merge init
  init = merge({ method }, defaultInit, init);

  return [url, init as IFetchInit];
}

export function fetch(config: IFetchRequest, init?: IFetchInit): Promise<any> {
  const { method, cache } = config;

  // parser param
  const [url, newInit] = fetchParamParser(config, init);

  if (cache && lcache.has(url)) {
    return Promise.resolve(lcache.get(url));
  }
  // 超时处理
  let request: Promise<any>;
  if (newInit.timeout === false) {
    request = window.fetch(url, newInit);
  } else {
    const timeout =
      typeof newInit.timeout === 'number' ? newInit.timeout : defaultTimeout;

    request = Promise.race([window.fetch(url, newInit), fetchTimeout(timeout)]);
  }

  return request
    .then(response => {
      // fetch 异常处理
      return response.ok
        ? response.json()
        : {
            code: response.status,
            msg: response.statusText,
            result: null
          };
    })
    .then(responseData => {
      // 全局统一的 Fetch Notify
      const { code, msg, result } = responseData;

      let nextData;

      if (code < 300 && method !== 'GET') {
        store.commit('global/FETCH_NOTIFY', {
          type: 'success',
          message: msg
        });

        nextData = result;
      } else if (code >= 300) {
        store.commit('global/FETCH_NOTIFY', {
          type: 'error',
          message: msg
        });

        nextData = Promise.reject(msg);
      } else {
        if (code === 200 && method === 'GET' && cache) {
          lcache.set(url, result);
        }
        nextData = result;
      }

      return nextData;
    });
}

export default fetch;
