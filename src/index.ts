#!/usr/bin/env node

import DrupalSDK from 'drupal-sdk' ;
import config from './config';

import token from './access-token';
import * as pdex from './data';
import  drupal from './drupal_publish';

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
    const result = await token();

    const result2 = await pdex.contasPrestadas(result.data.access_token);

    await drupal(Drupal, 'contas_prestadas', result2);

    const result3 = await pdex.consultarRecursosFiscalizados(result.data.access_token);
    await drupal(Drupal, 'recursos_fiscalizados', result3);
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
