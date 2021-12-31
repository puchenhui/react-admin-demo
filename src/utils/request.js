import axios from "axios";
// import { getToken } from './auth';
import {message} from 'antd'

const instance = axios.create({
    baseURL: 'http://47.93.126.193:8088/com/fsopn/ipaas/', //设置公共请求头
    timeout: 5000
})

//response 全局请求拦截器，发送请求之前执行
// instance.interceptors.request.use(
//     config => {
//         const token = sessionStorage.getItem('token')
//         if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
//             config.headers.authorization = token  //请求头加上token
//         }
//         return config
//     },
//     err => {
//         return Promise.reject(err)
//     }
// )

// // 请求返回后处理数据
// instance.interceptors.response.use(
//     response => {
//         //拦截响应，做统一处理 
//         //   if (response.data.code) {
//         //     switch (response.data.code) {
//         //       case 1002:
//         //         store.state.isLogin = false
//         //         router.replace({
//         //           path: 'login',
//         //           query: {
//         //             redirect: router.currentRoute.fullPath
//         //           }
//         //         })
//         //     }
//         //   }
//         return response
//     },
//     //接口错误状态处理，也就是说无响应时的处理
//     error => {
//         return Promise.reject(error.response.status) // 返回接口返回的错误信息
//     }
// )



instance.interceptors.request.use(
    config => {
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)
instance.interceptors.response.use(
    response => {
        // 根据后端约定，response.data形式为{success:boolean, message:string, content:any}
        if (response.status === 200) {
            return response.data
        } else {
            message.error(response.status)
            Promise.reject(response.status)
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
/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject(error)
        })
    })
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject(error)
        })
    })
}