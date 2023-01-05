const MONEVI_BASE_URL: string = "http://localhost:8080/api/monevi";
const REGIONS: string = "/region";
const ORGANIZATIONS: string = "/organization";
const GET_ALL: string = "/all";

const GET_REGIONS_PATH = REGIONS + GET_ALL
const GET_ORGANIZATIONS_PATH = ORGANIZATIONS + GET_ALL

export { 
    MONEVI_BASE_URL,
    GET_REGIONS_PATH,
    GET_ORGANIZATIONS_PATH
};