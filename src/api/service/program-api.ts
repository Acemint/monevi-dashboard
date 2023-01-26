import moneviAxios from '../configuration/monevi-axios';
import type { MoneviParamsGetPrograms } from '../model/monevi-config';
import { MoneviPath } from '../path/path';

export interface ProgramApi {
  getPrograms(organizationRegionId: string, period: string): any;
  lockProgram(userId: string, programId: string): any;
  deleteProgram(programId: string): any;
  editProgram(userId: string, programId: string, updateProgramRequest: any): any;
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

  async lockProgram(userId: string, programId: string): Promise<any> {
    var params = {} as { userId: string; programId: string };
    params.userId = userId;
    params.programId = programId;

    return await moneviAxios
      .get(MoneviPath.LOCK_PROGRAM_PATH, { params: params, paramsSerializer: { indexes: null } })
      .then((response) => {
        return response.data.value;
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

  async deleteProgram(programId: string): Promise<any> {
    var params = {} as { programId: string };
    params.programId = programId;

    return await moneviAxios
      .delete(MoneviPath.DELETE_PROGRAM_PATH, {
        params: params,
        paramsSerializer: {
          indexes: null,
        },
      })
      .then((response) => {
        return response.data.value;
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

  async editProgram(userId: string, programId: string, updateProgramRequest: any): Promise<any> {
    var params = {} as { userId: string; programId: string };
    params.userId = userId;
    params.programId = programId;

    var body = {} as { name: string; subsidy: number; budget: number; startDate: string; endDate: string };
    body.name = updateProgramRequest.name;
    body.subsidy = updateProgramRequest.subsidy;
    body.budget = updateProgramRequest.budget;
    body.startDate = updateProgramRequest.startDate;
    body.endDate = updateProgramRequest.endDate;

    return await moneviAxios
      .post(MoneviPath.UPDATE_PROGRAM_PATH, body, {
        params: params,
        paramsSerializer: { indexes: null },
      })
      .then((response) => {
        return response.data.value;
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
