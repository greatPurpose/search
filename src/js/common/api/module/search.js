
// This is an example will not work
// Just only show case how I would orangize
import axios from axios;
const API_ENDPOINT = 'https://search.zaidan.io/api/v1/'

export const getTopTenAvengers = (query = {}) => {
  
  return axios.get(`${API_ENDPOINT}?count=10`)
}

