import DrupalSDK from 'drupal-sdk';
import debug from 'debug';
import config from './config';

const d = debug('pdx:drupal');

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
    const result = await content.read('', {
      filter: {title: {value: key}},
    });

    if (result.data?.length > 0) {
      return await content.update(result.data[0].id, {
        attributes: {
          ...data,
        },
      });
    }

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
