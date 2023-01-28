import { moneviAxios } from '../configuration/monevi-axios';
import { MoneviPath } from '../path/path';

export interface WalletApi {
  getWallet(generalLedgerAccountName: string, organizationRegionId: string): any;
}

export class WalletApiImpl implements WalletApi {
  async getWallet(generalLedgerAccountName: string, organizationRegionId: string): Promise<any> {
    var params = {} as { type: string; organizationRegionId: string };
    params.type = generalLedgerAccountName;
    params.organizationRegionId = organizationRegionId;

    return await moneviAxios.get(MoneviPath.GET_WALLET_AMOUNT_PATH, { params });
  }
}

let walletApi = new WalletApiImpl();
export { walletApi };
