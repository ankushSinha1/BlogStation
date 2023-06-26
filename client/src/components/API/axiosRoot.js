import axios from 'axios';
const user = localStorage.getItem('user');
const rootRoute = axios.create({
    baseURL: 'https://blogstation-agfm.onrender.com/',
})
export default rootRoute