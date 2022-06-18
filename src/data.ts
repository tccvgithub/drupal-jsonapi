import axios from "axios";
import config from "./config";

export interface ContaPrestada {
  ano: number;
  mes: number;
  descricao: string;
  total: number;
}

export interface ContaGerencia {
  ano_gerencia: number;
  total: number;
}

export async function getVolumeRecursosFiscalizados(
  token: string,
): Promise<Array<ContaPrestada>> {
  const url = `${config.remoteApiUrl}/t/nosi.gov/tribunaldecontas/1.0.0/recursosfiscalizados`;
  const result = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data.Entries.Entry.map((x: ContaPrestada) => {
    return {
      ano: x.ano,
      mes: x.mes,
      descricao: x.descricao,
      total: x.total || 0,
    };
  });
}

export async function processosDecididosNaPrevia(
  token: string,
): Promise<Array<ContaGerencia>> {
  const url = `${config.remoteApiUrl}/t/nosi.gov/tribunaldecontas/1.0.0/contasprestadas`;

  const result = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data.Entries.Entry;
}

export async function consultarRecursosFiscalizados(
  token: string,
): Promise<Array<ContaPrestada>> {
  const url = `${config.remoteApiUrl}/t/nosi.gov/tribunaldecontas/1.0.0/processosdecididosnaprevia`;
  const result = await axios.get(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data.Entries.Entry;
}
