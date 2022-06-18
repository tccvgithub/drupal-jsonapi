#!/usr/bin/env node

import DrupalSDK from "drupal-sdk";

import config from "./config";

import token from "./access-token";
import * as pdex from "./data";
import {
  publish_conta_prestada,
  publish_conta_gerencia,
} from "./drupal_publish";

const Drupal = new DrupalSDK({
  url: config.drupalHost,
});

(async () => {
  try {
    await Drupal.login(config.drupalUser!, config.drupalPass!);
  } catch (e) {
    console.error("Unable to login to drupal");
    throw e;
  }

  const accessToken = await token();

  try {
    const result1 = await pdex.getVolumeRecursosFiscalizados(accessToken);
    await Promise.all(
      await publish_conta_prestada(Drupal, "indicador_1", result1),
    );
  } catch (e) {
    console.error("Unable to publish conta prestada");
  }

  try {
    const result2 = await pdex.consultarRecursosFiscalizados(accessToken);
    await Promise.all(
      await publish_conta_prestada(Drupal, "indicador_2", result2),
    );
  } catch (e) {
    console.error("Unable to publish conta gerencia");
  }

  try {
    const result3 = await pdex.processosDecididosNaPrevia(accessToken);
    await Promise.all(
      await publish_conta_gerencia(Drupal, "indicador_3", result3),
    );
  } catch (e) {
    console.error("Unable to publish conta gerencia");
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
