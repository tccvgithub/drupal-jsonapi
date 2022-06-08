import * as dotenv from 'dotenv';

dotenv.config();

const config = {
	remoteApiUrl: process.env.PDEX_REMOTE_API_URL,
	remoteApiUser: process.env.PDEX_REMOTE_API_USER,
	remoteApiPass: process.env.PDEX_REMOTE_API_PASS,
	drupalHost: process.env.PDEX_DRUPAL_HOST || '',
	drupalUser: process.env.PDEX_DRUPAL_USER,
	drupalPass: process.env.PDEX_DRUPAL_PASS,
};

export default config;