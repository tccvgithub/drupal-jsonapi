import config from './config';
import axios from 'axios';

export default async function accessToken(): Promise<string> {
	const url = `${config.remoteApiUrl}/token`;
	const result = await axios.post(url, 'grant_type=client_credentials', {
		headers: {
			'Authorization': `Basic ${Buffer.from(config.remoteApiUser + ':' + config.remoteApiPass).toString('base64')}`,
		},
	}); 

	return result.data.access_token;
}