import {upsertContent} from '../drupal';
import axios from 'axios';
import debug from 'debug';

import config from '../config';
import {months} from './constants';
import {ContaPrestada} from './data-types';

const d = debug('pdx:data:processosdecididosnaprevia');

export async function getProcessosDecididosNaPrevia(
  token: string
): Promise<Array<ContaPrestada>> {
  const url = `${config.remoteApiUrl}/tribunaldecontas/1.0.0/processosdecididosnaprevia`;
  d('Getting conta prestada from %s', url);
  const result = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  d('Received the following data: %O', result.data);

  return result.data.Entries.Entry;
}

/**
 *
 * @param Drupal
 * @param entity
 */
export function publishProcessosDecididosNaPrevia(
  entity: string,
  data: Array<ContaPrestada>
): any {
  const mapField: Record<string, string> = {
    Recusa: 'field_recusa',
    Visto: 'field_visto',
    'Isento de Visto': 'field_isento_visto',
    Devolução: 'field_devolucao',
    'Visto com Recomendações': 'field_visto_recomendacao',
    VT: 'field_vt',
  };

  return data.map((x: ContaPrestada) => {
    const key = `${x.ano}-${x.mes}`;
    const fieldKey: string = mapField[x.descricao];
    const fieldToUpdate: Record<string, number> = {};
    fieldToUpdate[fieldKey] = x.total;

    return upsertContent(entity, key, {
      field_year: x.ano,
      field_month: +x.mes,
      field_month_text: months[+x.mes - 1],
      field_year_month: `${x.ano}-${months[+x.mes - 1]}`,
      ...fieldToUpdate,
    });
  });
}
