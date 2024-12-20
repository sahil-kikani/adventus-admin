import axios from 'axios'

const Axios = axios.create({
  baseURL: 'https://adventus-admin-api.pdwap.store/api/'
})

Axios.interceptors.request.use(req => {
  if (typeof window !== 'undefined') {
    const token = localStorage?.getItem('accessToken')
    if (!req.headers.Authorization && token) {
      req.headers.Authorization = `Bearer ${token}`
    }
  }
  return req
})

export default Axios
