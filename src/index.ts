#!/usr/bin/env node

import DrupalSDK from "drupal-sdk";

import config from "./config";

import token from "./access-token";
import * as pdex from "./data";
import {
  publish_conta_prestada,
  publish_conta_gerencia,
  publish_volumes,
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

  // try {
  //   const resultX = await pdex.getVolumeRecursosFiscalizados(accessToken);
  //   console.log('DEBUG 1 ', resultX);
  //   await publish_volumes(Drupal, "indicador_x", resultX);    
  // } catch (e) {
  //   console.error("Unable to publish conta prestada");
  // }

  try {
    const result2 = await pdex.consultarRecursosFiscalizados(accessToken);
    console.log('DEBUG 2 ', result2);
    await publish_conta_prestada(Drupal, "indicador_2", result2);
  } catch (e) {
    console.error("Unable to publish conta gerencia");
    console.log(e);
  }

  // try {
  //   const result3 = await pdex.processosDecididosNaPrevia(accessToken);
  //   await publish_conta_gerencia(Drupal, "indicador_3", result3);    
  // } catch (e) {
  //   console.error("Unable to publish conta gerencia");
  // }
})();