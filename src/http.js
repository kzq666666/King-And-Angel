import axios from 'axios'
import { Loading, Message } from 'element-ui'

axios.create({
    baseURL:'https://king-api.ncu204.com',
    timeout: 10000,
    headers:{
        "Authorization":sessionStorage.token
    }
});
var loadingInstance;
axios.interceptors.request.use(
    config => {
        loadingInstance = Loading.service({ fullscreen: true});
        return config
    },
    error => {
        loadingInstance.close();
        Message.error('加载超时')
        return Promise.reject(error)
    }
)
axios.interceptors.response.use(
    data => {
        loadingInstance.close();
        return data
    },
    error => {
        loadingInstance.close();
        Message.error('加载失败');
        return Promise.reject(error)
    }
)
export default axios