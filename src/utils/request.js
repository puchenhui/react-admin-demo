import axios from "axios";
// import { getToken } from './auth';
import {message} from 'antd'

const instance = axios.create({
    // baseURL: 'http://47.93.126.193:8088/com/fsopn/ipaas/', //设置公共请求头
    baseURL: 'http://www.fsopn-ipaas.com:8088/com/fsopn/ipaas/', //设置公共请求头
    timeout: 10000
})


// instance.interceptors.request.use(
//     config => {
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     }
// )
instance.interceptors.response.use(
    response => {
      if (response.config.responseType == "blob") {
        if (response.status === 200) {
          return response
        } else {
            return Promise.reject(new Error('请求异常'));
        }
      } else {
        if (response.status === 200) {
            // 400 失败 FAIL("400", "Failure"),
            // 403 没有权限 NO_PERMISSION("403", "Need Authorities")
            // 402 未登录 LOGIN_NO("402", "Need Login"),
            // 401 登陆失败 LOGIN_FAIL("401", "Login Failure"),
            // 101 回话到期 SESSION_EXPIRES("101", "Session Expires"),
            // 501 未知错误 UNKNOWN_ERROR("501","Unknown Error");

            switch (response.data.code) {
                case '200':
                return response.data.data;
                case '400':
                return message.error('接口调取失败');
                case '403':
                return message.error('没有权限');
                case '402':
                return message.error('未登录');
                case '401':
                return message.error('登录失败');
                case '101':
                return message.error('回话到期');
                case '501':
                return message.error('未知错误');
                default:
                return message.error('请检查网络');
            }
            
        } else {
            return Promise.reject(new Error('请求异常'));
        }
      }
    },
    error => {
        if (error.response) {
            if (error.response.status === 401) {
                // 这种情况一般调到登录页
            } else if (error.response.status === 403) {
                // 提示无权限等
            } else {
                // 其他错误处理
            }
        }
        return Promise.reject(error)
    })
// 统一封装get请求
export const get = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

// 统一封装post请求
export const post = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}