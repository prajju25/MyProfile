import axios from 'axios';

const headers = {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
};

export const HttpGet = (url: string) => {
    let fullURL = process.env.PROFILE_SERVICE + url;
    return axios.get(fullURL, headers);
}