import axios from './axios.js';

export const getMessage = (problemId)=>{
    return axios.get(`/messages/${problemId}`)
}

