import moneviAxios from '../configuration/monevi-axios';
import type { MoneviParamsGetPrograms } from '../model/monevi-config';
import { MoneviPath } from '../path/path';

export interface ProgramApi {
  getPrograms(organizationRegionId: string, period: string): any;
  editProgram(userId: string, programId: string, updateSubsidyRequest: any): any;
}

export class ProgramApiImpl implements ProgramApi {
  async getPrograms(organizationRegionId: string, period: string | null = null): Promise<any> {
    var params = {} as MoneviParamsGetPrograms;
    params.organizationRegionId = organizationRegionId;
    if (period != null) {
      params.period = period;
    }
    return await moneviAxios
      .get(MoneviPath.GET_PROGRAMS_PATH, {
        params: params,
        paramsSerializer: {
          indexes: null,
        },
      })
      .then((response) => {
        return response.data.values;
      })
      .catch((error) => {
        if (error.response.status == 500 || error.response.status == 400) {
          for (const key in error.response.data.errorFields) {
            var errorMessage = error.response.data.errorFields[key];
            alert(errorMessage);
            break;
          }
        }
        return new Array<any>();
      });
  }

  async editProgram(userId: string, programId: string, updateSubsidyRequest: any): Promise<any> {
    var params = {} as { userId: string; programId: string };
    params.userId = userId;
    params.programId = programId;

    var body = {} as { name: string; subsidy: number; budget: number };
    body.name = updateSubsidyRequest.name;
    body.subsidy = updateSubsidyRequest.subsidy;
    body.budget = updateSubsidyRequest.budget;

    return await moneviAxios
      .post(MoneviPath.DECLINE_STUDENT_PATH, body, {
        params: params,
        paramsSerializer: { indexes: null },
      })
      .then((response) => {
        return response.data.values;
      })
      .catch((error) => {
        for (const key in error.response.data.errorFields) {
          var errorMessage = error.response.data.errorFields[key];
          alert(errorMessage);
          break;
        }
        return null;
      });
  }
}

let programApi = new ProgramApiImpl();
export { programApi };
