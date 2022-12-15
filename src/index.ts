#!/usr/bin/env node
import axios from 'axios';
import debug from 'debug';
import pThrottle from 'p-throttle';

const throttle = pThrottle({
  limit: 2,
  interval: 3000,
});

const d = debug('pdx:main');

import token from './access-token';

import {login} from './drupal';
import * as data from './data';

(async () => {
  await login();

  d('Getting remote api access token');
  const accessToken = await token();
  d(`Access token '${accessToken}'`);

  try {
    const result = await data.getRecursosFiscalizados(accessToken);
    const promises = data.publishRecursosFiscalizados('indicador_x', result);
    await Promise.all(promises.map(throttle));
  } catch (e: any) {
    console.error('Unable to publish conta prestada', e.message);
    return;
  }

  try {
    const result = await data.getProcessosDecididosNaPrevia(accessToken);
    console.log('DEBU', JSON.stringify(result, null, 2));
    let index;
    for (index = 0; index < 1; index += 1) {
      const partialResult = result.slice(index, index + 1);
      const promises = data.publishProcessosDecididosNaPrevia(
        'indicador_2',
        partialResult
      );
      await Promise.all(promises);
    }
    console.log('INDEX ', index);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      console.error('Unable to publish conta gerencia', e.response?.data);
    } else {
      console.error('Unable to publish conta gerencia', e.message);
    }
    return;
  }

  try {
    const result = await data.getContasPrestadas(accessToken);
    const promises = data.publishContasPrestadas('indicador_3', result);
    await Promise.all(promises.map(throttle));
  } catch (e: any) {
    console.error('Unable to publish conta gerencia', e.message);
  }
})();
