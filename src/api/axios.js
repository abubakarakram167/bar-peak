import axios from 'axios';

const jazz = 'http://192.168.1.104:3000/graphql?'
const optix = 'http://192.168.100.233:3000/graphql?'

export default axios.create({
  baseURL: 'http://192.168.1.102:3000/'
})