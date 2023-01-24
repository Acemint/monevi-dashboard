import moneviAxios from "../configuration/monevi-axios";
import type { MoneviParamsGetReports } from "@/api/model/monevi-config";
import { MoneviPath } from "../path/path";
import { MoneviDateFormatter } from "../methods/monevi-date-formatter";


export interface ReportApi {
  getReports(organizationRegionId: string, date: string): any;
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

}

let reportApi = new ReportApiImpl();
export { reportApi }




