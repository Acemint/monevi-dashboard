const MONEVI_BASE_URL: string = "http://localhost:8080/api/monevi";
const REGIONS: string = "/region";
const ORGANIZATIONS: string = "/organization";
const USER: string = "/user";
const SUPERVISOR: string = "/supervisor";
const STUDENT: string = "/student";
const PROGRAM: string = "/program";
const GET_ALL: string = "/all";
const FIND_ALL_STUDENT: string = "/find-all-student";
const APPROVE_STUDENT: string = "/approve-account";
const DECLINE_STUDENT: string = "/decline-account";
const REGISTER: string = "/register";
const AUTH: string = "/auth";
const LOGIN: string = "/login";
const CREATE_NEW: string = '/create-new';

const GET_REGIONS_PATH: string = REGIONS + GET_ALL
const GET_ORGANIZATIONS_PATH: string = ORGANIZATIONS + GET_ALL
const REGISTER_STUDENT_PATH: string = USER + REGISTER + STUDENT
const LOGIN_PATH: string = USER + AUTH + LOGIN
const CREATE_NEW_PROGRAM_PATH: string = PROGRAM + CREATE_NEW
const GET_PROGRAMS_PATH: string = PROGRAM + GET_ALL
const GET_STUDENTS_PATH: string = USER + FIND_ALL_STUDENT
const APPROVE_STUDENT_PATH: string = USER + SUPERVISOR + APPROVE_STUDENT
const DECLINE_STUDENT_PATH: string = USER + SUPERVISOR + DECLINE_STUDENT


export { 
    MONEVI_BASE_URL,
    GET_REGIONS_PATH,
    GET_ORGANIZATIONS_PATH,
    REGISTER_STUDENT_PATH,
    LOGIN_PATH,
    CREATE_NEW_PROGRAM_PATH,
    GET_PROGRAMS_PATH
    GET_STUDENTS_PATH,
    APPROVE_STUDENT_PATH,
    DECLINE_STUDENT_PATH
};class MoneviPath {
    
    static REQUEST_RESET_PASSWORD_PATH = USER + AUTH + REQUEST_RESET_PASSWORD;
    static RESET_PASSWORD_PATH = USER + AUTH + RESET_PASSWORD;

}


export { MoneviPath };