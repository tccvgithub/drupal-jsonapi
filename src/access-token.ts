import config from './config';
import axios from 'axios';
import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: 3 });


export default async function accessToken() {
	const url = `${config.remoteApiUrl}/token`;
	return axios.post(url, 'grant_type=client_credentials', {
		headers: {
			'Authorization': `Basic ${Buffer.from(config.remoteApiUser + ':' + config.remoteApiPass).toString('base64')}`,
		},
		
	}); 
}