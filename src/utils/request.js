import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

const server = axios.create({
    // 过期时间
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
server.defaults.baseURL='/api'

//   请求拦截器
server.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
      return config;
    },
  )

//   响应拦截器
  server.interceptors.response.use(
    (res) => {
      // 2xx 范围内的状态码都会触发该函数。
      // 对响应数据做点什么
      let msg = res.data['msg'] || '未知错误，请联系管理员'
      switch (res.code) {
        case 401:{
          msg = '认证失败，无法访问系统资源'
          router.replace('/');
          break
        }
          //......
        case 'default':
          msg = '系统未知错误'
          break
      }
      if (res.code === 200) {
        return Promise.resolve(msg)
      } else {
        Message.error(msg)
        return Promise.reject(msg)
      }
    },
    (error) => {
      // 超出 2xx 范围的状态码都会触发该函数
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  )


export default server;
