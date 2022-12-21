import DrupalSDK from 'drupal-sdk';
import debug from 'debug';
import pThrottle from 'p-throttle';
import config from './config';

const d = debug('pdx:drupal');

const throttle = pThrottle({
  limit: 2,
  interval: 3000,
});

export const Drupal = new DrupalSDK({
  url: config.drupalHost,
});

export const login = async () => {
  if (Drupal.api.getRequestCookie().length === 0) {
    d('Loggin in to drupal');
    await Drupal.login(config.drupalUser!, config.drupalPass!);
    d('Logged in to drupal');
  }
};

export const upsertContent = async (
  entity: string,
  key: string,
  data: Record<string, unknown>
): Promise<void> => {
  const content = Drupal.get('node', entity);

  try {
    console.log(' GET DATA FOR ', key);
    const result = await content.read('', {
      filter: {title: {value: key}},
    });
    console.log('RESULT', result);
    if (result.data?.length > 0) {
      console.log('UPDATE', result.data[0].id, JSON.stringify(data, null, 2));
      return await content.update(result.data[0].id, {
        attributes: {
          ...data,
        },
      });
    }
    console.log('CREATE', JSON.stringify(data, null, 2));
    return await content.create({
      attributes: {
        title: key,
        ...data,
      },
    });
  } catch (e: any) {
    d('Error while upserting content', e.message);
    throw e;
  }
};
