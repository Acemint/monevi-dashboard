const MONEVI_BASE_URL: string = "http://localhost:8080/api/monevi";
const REGIONS: string = "/region";
const ORGANIZATIONS: string = "/organization";
const USER: string = "/user";
const SUPERVISOR: string = "/supervisor";
const STUDENT: string = "/student";
const GET_ALL: string = "/all";
const REGISTER: string = "/register";

const GET_REGIONS_PATH: string = REGIONS + GET_ALL
const GET_ORGANIZATIONS_PATH: string = ORGANIZATIONS + GET_ALL
const REGISTER_STUDENT_PATH: string = USER + REGISTER + STUDENT
const REGISTER_SUPERVISOR_PATH: string =  USER + REGISTER + SUPERVISOR

export { 
    MONEVI_BASE_URL,
    GET_REGIONS_PATH,
    GET_ORGANIZATIONS_PATH, 
    REGISTER_SUPERVISOR_PATH,
    REGISTER_STUDENT_PATH
};