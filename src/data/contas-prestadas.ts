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
  const currentYear = new Date().getFullYear();

  return data.map((x: ContaGerencia) => {
    const key = `${x.ano_gerencia || currentYear}`;

    return upsertContent(entity, key, {
      field_year: x.ano || currentYear,
      field_ano_gerencia: x.ano_gerencia || currentYear,
      field_total: x.total,
    });
  });
}
