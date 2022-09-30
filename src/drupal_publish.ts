import DrupalSDK from "drupal-sdk";
import { ContaGerencia, ContaPrestada } from "./data";


const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

/**
 *
 * @param Drupal
 * @param entity
 */
export  async function publish_conta_prestada(
  Drupal: DrupalSDK,
  entity: string,
  data: Array<ContaPrestada>,
): Promise<Array<Promise<any>>> {
  return data.map(async (x) => {
    const content = Drupal.get("node", entity);

    const result = await content.read("", {
      filter: { title: { value: `${x.ano}-${x.mes}-${x.descricao}` } },
    });

    if (result.data?.length > 0) {
      return content.update(result.data[0].id, {
        attributes: {
          field_year: x.ano,
          field_month: +x.mes,
          field_year_month: `${x.ano}-${months[+x.mes]}`,
          field_description: x.descricao,
          field_total: x.total,
        },
      });
    }

    return content
      .create({
        attributes: {
          title: `${x.ano}-${x.mes}-${x.descricao}`,
          field_year: x.ano,
          field_month: +x.mes,
          field_description: x.descricao,
          field_total: x.total,
        },
      })
      .then(
        (value) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(value);
            }, 3000);
          }),
      );
  });
}


/**
 *
 * @param Drupal
 * @param entity
 */
 export  async function publish_conta_gerencia(
  Drupal: DrupalSDK,
  entity: string,
  data: Array<ContaGerencia>,
): Promise<Array<Promise<any>>> {
  return data.map(async (x) => {
    const currentYear = new Date().getFullYear();
    const content = Drupal.get("node", entity);

    const result = await content.read("", {
      filter: { title: { value: `${x.ano_gerencia || currentYear}` } },
    });

    if (result.data?.length > 0) {
      return content.update(result.data[0].id, {
        attributes: {
          field_year: x.ano_gerencia,
          field_total: x.total,
        },
      });
    }

    return content
      .create({
        attributes: {
          title: `${x.ano_gerencia || currentYear}`,
          field_year: x.ano_gerencia || currentYear,
          field_total: x.total,
        },
      })
      .then(
        (value) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(value);
            }, 3000);
          }),
      );
  });
}
