import  DrupalSDK  from 'drupal-sdk';
import { ContaPrestada } from './data';


/**
 * 
 * @param Drupal 
 * @param entity 
 */
export default async function publish(Drupal: DrupalSDK, entity: string, data: Array<ContaPrestada>) {
		const content = Drupal.get(entity);

		content.entityType = 'node';
		content.bundle = entity;

		const prom = data.map( x => {

			return content.create({ attributes: {
				title: `${x.ano}-${x.mes}`,
				field_year: x.ano,
				field_month: +x.mes,
				field_description: x.descricao,
				field_total: x.total,
			}});

		});

		return Promise.all(prom);
}