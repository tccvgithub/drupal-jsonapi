#!/usr/bin/env node

import DrupalSDK from 'drupal-sdk' ;

import config from './config';

import token from './access-token';
import * as pdex from './data';
import drupal from './drupal_publish';

const Drupal = new DrupalSDK({
  url: config.drupalHost,
});


(async () => {

  try {
    await Drupal.login(config.drupalUser!, config.drupalPass!);
  } catch (e) {
    console.error('Unable to login to drupal');
    throw e;
  }

  try {
    const accessToken = await token();

    const result1 = await pdex.getVolumeRecursosFiscalizados(accessToken);
    const result2 = await pdex.consultarRecursosFiscalizados(accessToken);
    const result3 = await pdex.processosDecididosNaPrevia(accessToken);

    await Promise.all(await drupal(Drupal, 'indicatores_1', result1));
    await Promise.all(await drupal(Drupal, 'indicatores_2', result2));
    await Promise.all(await drupal(Drupal, 'indicatores_3', result3));

  } catch (e) {
    console.log('ERROR', JSON.stringify(e, null, 2));
  }
})();









// const fetchData = async () => {

//   

//   const pippo = Drupal.get('Indicadores');


//   pippo.entityType = 'node'
//   pippo.bundle = 'Indicadores'

//   await pippo.create({ attributes: 
//     { 
//       title: '2020-06',
//       field_year: 2020,
//       field_month: 6,
//       field_description: 'test 123',
//       field_total: 100123,
//   } 
// });




// }

// fetchData();
