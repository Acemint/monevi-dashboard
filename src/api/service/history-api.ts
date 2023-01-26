import moneviAxios from '../configuration/monevi-axios';
import { MoneviPath } from '../path/path';

export interface HistoryApi {
  getHistories(userId: string): any;
}

export class HistoryApiImpl implements HistoryApi {
  async getHistories(userId: string): Promise<any> {
    var params = {} as { userId: string };
    params.userId = userId;
    return await moneviAxios
      .get(MoneviPath.GET_HISTORIES_PATH, { params })
      .then((response) => {
        return response.data.values;
      })
      .catch((error) => {
        return null;
      });
  }
}

let historyApi = new HistoryApiImpl();
export { historyApi };
