const MONEVI_BASE_URL: string = "http://localhost:8080/api/monevi";
const REGIONS: string = "/region";
const ORGANIZATIONS: string = "/organization";
const USER: string = "/user";
const STUDENT: string = "/student";
const GET_ALL: string = "/all";
const REGISTER: string = "/register";
const AUTH: string = "/auth";
const LOGIN: string = "/login";

const GET_REGIONS_PATH: string = REGIONS + GET_ALL
const GET_ORGANIZATIONS_PATH: string = ORGANIZATIONS + GET_ALL
const REGISTER_STUDENT_PATH: string = USER + REGISTER + STUDENT
const LOGIN_PATH: string = USER + AUTH + LOGIN

export { 
    MONEVI_BASE_URL,
    GET_REGIONS_PATH,
    GET_ORGANIZATIONS_PATH,
    REGISTER_STUDENT_PATH,
    LOGIN_PATH
};