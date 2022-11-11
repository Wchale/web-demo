import axios from "axios";

export const sheet = axios.create({
    baseURL: 'http://192.168.0.186:8086/',
})

export const exam = axios.create({
    baseURL: 'http://192.168.0.186:8080/'
})

sheet.interceptors.response.use(response => {
    return response.data
})
exam.interceptors.response.use(response => {
    return response.data
})
