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
    await data.publishRecursosFiscalizados('indicador_x', result);
  } catch (e: any) {
    console.error('Unable to publish conta prestada', e.message);

  }

  try {
    const result = await data.getProcessosDecididosNaPrevia(accessToken);
    let index;
    for (index = 0; index < result.length; index += 1) {
      const partialResult = result.slice(index, index + 1);
      d('Publishing', partialResult.length, 'processos decididos na previa');
      const promises = data.publishProcessosDecididosNaPrevia(
        'indicador_2',
        partialResult
      );
      await Promise.allSettled(promises);
    }
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      console.error('Unable to publish conta gerencia', e.response?.data);
    } else {
      console.error('Unable to publish conta gerencia', e.message);
    }
  }

  try {
    const result = await data.getContasPrestadas(accessToken);
    d('Result from API');
    d(JSON.stringify(result, null, 2));
    const promises = data.publishContasPrestadas('indicador_3', result);
    await Promise.all(promises.map(throttle));
  } catch (e: any) {
    d('Error' + e);
    console.error('Unable to publish conta gerencia', e.message);
  }
})();
