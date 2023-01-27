import moneviAxios from "../configuration/monevi-axios";
import type { MoneviParamsGetReports, MoneviParamsSummarizeReport } from "@/api/model/monevi-config";
import { MoneviPath } from "../path/path";
import { MoneviDateFormatter } from "../methods/monevi-date-formatter";
import { MoneviReportSummary } from "../model/monevi-model";


export interface ReportApi {
  getReports(organizationRegionId: string, date: string): any;
  summarizeReport(organizationRegionId: string, date: string): any;
}

export class ReportApiImpl implements ReportApi {

  async getReports(organizationRegionId: string, date: string): Promise<any> {
    var params = {} as MoneviParamsGetReports;
    params.organizationRegionId = organizationRegionId;
    var datesBetween = MoneviDateFormatter.getFirstDateAndLastDateOfADate(date);
    params.startDate = datesBetween[0];
    params.endDate = datesBetween[1];

    return moneviAxios
      .get(MoneviPath.GET_REPORTS_PATH, { params: params })
      .then((response) => {
        return response.data.values;
      })
      .catch((error) => {
        console.error('Internal Server Error, unable to get reports data');
        return null;
      });
  }

  async summarizeReport(organizationRegionId: string, date: string): Promise<any> {
    var params = {} as MoneviParamsSummarizeReport;
    params.organizationRegionId = organizationRegionId;
    params.date = date;

    var reportSummary = await moneviAxios.get(MoneviPath.SUMMARIZE_REPORT_PATH, {
      params: params,
      paramsSerializer: {indexes: null}
    })
    .then((response) => {
      return response.data.value;
    })
    .catch((error) => {
      console.error("internal server error, unable to get report summary");
      return null;
    })

    if (!reportSummary) {
      return new MoneviReportSummary();
    }
    return this.extractReportSummary(reportSummary);
  }

  private extractReportSummary(reportSummary: any) {
    var report = new MoneviReportSummary();
    report.reportId = reportSummary.reportId;
    report.reportStatus = reportSummary.reportStatus;
    report.comment = reportSummary.comment;
    report.commentedBy = reportSummary.commentedBy;

    report.cash.income.daily.amount = reportSummary.generalLedgerAccountTypeData.CASH.transactionTypeData.DAILY.entryPositionData.DEBIT.amount;
    report.cash.income.nonDaily.amount = reportSummary.generalLedgerAccountTypeData.CASH.transactionTypeData.NON_DAILY.entryPositionData.DEBIT.amount;
    report.cash.expense.daily.amount = reportSummary.generalLedgerAccountTypeData.CASH.transactionTypeData.DAILY.entryPositionData.CREDIT.amount;
    report.cash.expense.nonDaily.amount = reportSummary.generalLedgerAccountTypeData.CASH.transactionTypeData.NON_DAILY.entryPositionData.CREDIT.amount;

    report.bank.income.daily.amount = reportSummary.generalLedgerAccountTypeData.BANK.transactionTypeData.DAILY.entryPositionData.DEBIT.amount;
    report.bank.income.nonDaily.amount = reportSummary.generalLedgerAccountTypeData.BANK.transactionTypeData.NON_DAILY.entryPositionData.DEBIT.amount;
    report.bank.expense.daily.amount = reportSummary.generalLedgerAccountTypeData.BANK.transactionTypeData.DAILY.entryPositionData.CREDIT.amount;
    report.bank.expense.nonDaily.amount = reportSummary.generalLedgerAccountTypeData.BANK.transactionTypeData.NON_DAILY.entryPositionData.CREDIT.amount;

    report.cash.opnameAmount = reportSummary.generalLedgerAccountTypeData.CASH.opnameAmount;
    report.cash.previousMonthAmount = reportSummary.generalLedgerAccountTypeData.CASH.previousMonthBalance;
    report.bank.opnameAmount = reportSummary.generalLedgerAccountTypeData.BANK.opnameAmount;
    report.bank.previousMonthAmount = reportSummary.generalLedgerAccountTypeData.BANK.previousMonthBalance;

    return report;
  }

}

let reportApi = new ReportApiImpl();
export { reportApi }




