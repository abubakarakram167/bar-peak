import axios from 'axios';

const jazz = 'http://192.168.1.101:3000/'
const optix = 'http://192.168.100.233:3000/'
const pHotspot = 'http://172.20.10.3:3000/'

export default axios.create({
  baseURL: jazz
})