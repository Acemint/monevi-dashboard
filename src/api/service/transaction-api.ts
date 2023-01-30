import type { MoneviParamsGetTransactions, MoneviBodyCreateTransaction } from '@/api/model/monevi-config';
import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';
import { moneviAxios } from '@/api/configuration/monevi-axios';
import { MoneviPath } from '@/api/path/path';

export interface TransactionApi {
  getTransactions(
    organizationRegionId: string,
    date: string,
    filterGeneralLedgerAccount: string,
    filterEntryPosition: string,
    filterType: string
  ): any;

  convertExcel(organizationRegionId: string, excelFile: File): any;

  addTransaction(transactions: Array<MoneviBodyCreateTransaction>): any;
}

export class TransactionApiImpl implements TransactionApi {
  async addTransaction(transactions: MoneviBodyCreateTransaction[]): Promise<any> {
    return moneviAxios
      .post(MoneviPath.CREATE_NEW_TRANSACTION_PATH, transactions)
      .then((response) => {
        alert('success in creating transaction');
        return response.data.values;
      })
      .catch((error) => {
        for (const key in error.response.data.errorFields) {
          var errorMessage = error.response.data.errorFields[key];
          alert(errorMessage);
          break;
        }
      });
  }

  async convertExcel(organizationRegionId: string, excelFile: File): Promise<any> {
    var params = {} as { organizationRegionId: string };
    params.organizationRegionId = organizationRegionId;

    var body = {} as { excelFile: File };
    body.excelFile = excelFile;

    return await moneviAxios
      .post(MoneviPath.CONVERT_EXCEL_PATH, body, {
        params: params,
        paramsSerializer: {
          indexes: null,
        },
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response.data.value;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  async getTransactions(
    organizationRegionId: string,
    date: string,
    filterGeneralLedgerAccount: string = 'Semua',
    filterEntryPosition: string = 'Semua',
    filterType: string = 'Semua'
  ): Promise<any> {
    var params = {} as MoneviParamsGetTransactions;
    params.page = 0;
    params.size = 1000;
    params.sortBy = new Array<string>('transactionDate');
    params.isAscending = new Array<string>('true');
    params.organizationRegionId = organizationRegionId;
    var datesBetween = MoneviDateFormatter.getFirstDateAndLastDateOfADate(date);
    params.startDate = datesBetween[0];
    params.endDate = datesBetween[1];
    if (filterGeneralLedgerAccount != 'Semua') {
      params.generalLedgerAccountType = MoneviEnumConverter.convertGeneralLedgerAccountType(filterGeneralLedgerAccount);
    }
    if (filterEntryPosition != 'Semua') {
      params.entryPosition = MoneviEnumConverter.convertEntryPosition(filterEntryPosition);
    }
    if (filterType != 'Semua') {
      params.transactionType = MoneviEnumConverter.convertTransactionType(filterType);
    }

    return await moneviAxios
      .get(MoneviPath.GET_TRANSACTIONS_PATH, {
        params: params,
        paramsSerializer: {
          indexes: null,
        },
      })
      .then((response) => {
        return response.data.values;
      })
      .catch((error) => {
        console.log(error);
        console.error('Internal Server Error, unable to get transactions data');
        return null;
      });
  }
}

let transactionApi = new TransactionApiImpl();
export { transactionApi };
