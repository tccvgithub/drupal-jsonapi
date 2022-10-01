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
    await publish_conta_prestada(Drupal, "indicador_1", result1);    
  } catch (e) {
    console.error("Unable to publish conta prestada");
  }

  try {
    const result2 = await pdex.consultarRecursosFiscalizados(accessToken);
    await publish_conta_prestada(Drupal, "indicador_2", result2);
  } catch (e) {
    console.error("Unable to publish conta gerencia");
    console.error(e);
  }

  try {
    const result3 = await pdex.processosDecididosNaPrevia(accessToken);
    await publish_conta_gerencia(Drupal, "indicador_3", result3);    
  } catch (e) {
    console.error("Unable to publish conta gerencia");
  }
})();