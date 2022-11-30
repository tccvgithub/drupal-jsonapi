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
): Promise<void> {
  const content = Drupal.get("node", entity);

  const mapField: Record<string, string> = {
    'Recusa': 'recusa',
    'Visto': 'visto',
    'Isento de Visto': 'isento_visto',
    'Devolução': 'devolucao',
    'Visto com Recomendação': 'visto_recomendacao',
    'VT': 'vt',
  };

  for(const x of data) {

    const result = await content.read("", {
      filter: { title: { value: `${x.ano}-${x.mes}` } },
    });


    const fieldKey: string = mapField[x.descricao];
    const fieldToUpdate: any = {};
    fieldToUpdate[fieldKey] = x.total;


    if (result.data?.length > 0) {
      return content.update(result.data[0].id, {
        attributes: {
          field_year: x.ano,
          field_month: +x.mes,
          field_year_month: `${x.ano}-${months[+x.mes]}`,
          ...fieldToUpdate,    
        },
      });
    }

    return content
      .create({
        attributes: {
          title: `${x.ano}-${x.mes}`,
          field_year: x.ano,
          field_month: +x.mes,
          field_year_month: `${x.ano}-${months[+x.mes]}`,
          ...fieldToUpdate,
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
  }
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



export  async function publish_volumes(
  Drupal: DrupalSDK,
  entity: string,
  data: Array<ContaPrestada>,
): Promise<void> {

  for(const x of data) {
  
    const content = Drupal.get("node", entity);

    let descriptionNorm;
    let totalField = {};
    
    if (x.descricao === 'Prévia') {
      descriptionNorm = 'previa';
      totalField = { field_previa: x.total };
    } else  {
      descriptionNorm = 'sucessiva';
      totalField = { field_sucessiva: x.total };
    }

    const result = await content.read("", {
      filter: { title: { value: `X-${x.ano}-${x.mes}` } },
    });

    if (result.data?.length > 0) {    
      await content.update(result.data[0].id, {
        attributes: {
          field_year: x.ano,
          field_month: +x.mes,
          field_year_month: `${x.ano}-${months[+x.mes]}`,
          ...totalField,          
        },
      });
    }    

    await content
      .create({
        attributes: {
          title: `X-${x.ano}-${x.mes}`,
          field_year: x.ano,
          field_month: +x.mes,          
          field_year_month: `${x.ano}-${months[+x.mes]}`,
          ...totalField,
        },
      })
      .then(
        (value) =>
          // friction to throttle requests to drupal
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(value);
            }, 3000);
          }),
      );
  }
}

