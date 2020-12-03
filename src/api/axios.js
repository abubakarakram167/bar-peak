import axios from 'axios';

const jazz = 'http://192.168.1.101:3000/'
const optix = 'http://192.168.100.233:3000/'
const pHotspot = 'http://172.20.10.3:3000/'

const environment = process.env.NODE_ENV || 'development';
var url = '';
if(environment === "development"){
  url = optix
}
else
  url = 'https://barpeak-backend.herokuapp.com/'

console.log("the url", url);
console.log("the node environemnt", process.env.NODE_ENV);  

export default axios.create({
  baseURL: url
})