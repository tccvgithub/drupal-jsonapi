import axios from 'axios';
import debug from 'debug';

import config from '../config';
import {upsertContent} from '../drupal';
import {ContaGerencia} from './data-types';

const d = debug('pdx:data:contasprestadas');

export async function getContasPrestadas(
  token: string
): Promise<Array<ContaGerencia>> {
  const url = `${config.remoteApiUrl}/tribunaldecontas/1.0.0/contasprestadas`;
  const result = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data.Entries.Entry;
}

/**
 *
 * @param Drupal
 * @param entity
 */
export function publishContasPrestadas(
  entity: string,
  data: Array<ContaGerencia>
): any {
  return data.map((x: ContaGerencia) => {
    if (!x.ano || !x.ano_gerencia) {
      throw new Error('Missing required field');
    }

    const key = `${x.ano}-${x.ano_gerencia}`;

    return upsertContent(entity, key, {
      field_year: x.ano,
      field_ano_gerencia: x.ano_gerencia,
      field_total: x.total,
    });
  });
}
