import debug from 'debug';
import axios from 'axios';

import config from '../config';
import {months} from './constants';

import {upsertContent} from '../drupal';
import {ContaPrestada} from './data-types';

const d = debug('pdx:data:recursosfiscalizados');

// this value is used to scale the figures to thousands
// otherwise too big to be displayed in the charts
const scaleFactor = 1;

/** retrieve data from api */
export async function getRecursosFiscalizados(
  token: string
): Promise<Array<ContaPrestada>> {
  const url = `${config.remoteApiUrl}/tribunaldecontas/1.0.0/recursosfiscalizados`;
  d('Getting conta prestada from %s', url);
  const result = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  d('Received the following data: %O', result.data);
  return result.data.Entries.Entry.map((x: ContaPrestada) => {
    return {
      ano: x.ano,
      mes: x.mes,
      descricao: x.descricao,
      total: x.total || 0,
    };
  });
}

/** publish api data to drupal */
export async function publishRecursosFiscalizados(
  entity: string,
  data: Array<ContaPrestada>
) {
  for (const x of data) {
    // return data.map((x: ContaPrestada) => {
    let totalField = {};

    const key = `X-${x.ano}-${x.mes}`;
    if (x.descricao === 'Prévia') {
      totalField = {field_previa: +(x.total / scaleFactor)};
    } else {
      totalField = {field_sucessiva: +(x.total / scaleFactor)};
    }

    try {
      await upsertContent(entity, key, {
        field_year: x.ano,
        field_month: +x.mes,
        field_month_text: months[+x.mes - 1],
        field_year_month: `${x.ano}-${months[+x.mes - 1]}`,
        ...totalField,
      });
    } catch (err) {
      console.error('Error while updating', key, totalField, err);
    }
  }
}
