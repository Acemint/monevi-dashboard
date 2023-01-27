import axios from 'axios';
import { MONEVI_BASE_URL } from '../path/path';

const moneviAxios = axios.create({
  baseURL: MONEVI_BASE_URL,
});

export default moneviAxios;
