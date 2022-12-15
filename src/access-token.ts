import debug from 'debug';
import axios from 'axios';
import config from './config';

const d = debug('pdx:token');

export default async function accessToken(): Promise<string> {
  const url = `${config.remoteAuthUrl}/token`;
  d('Getting access token from %s', url);
  const result = await axios.post(url, 'grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${Buffer.from(
        config.remoteApiUser + ':' + config.remoteApiPass
      ).toString('base64')}`,
    },
  });

  d('Got access token %s', result.data.access_token);

  return result.data.access_token;
}
