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
const RESET_PASSWORD = '/reset-password';
const REQUEST_RESET_PASSWORD = '/request/reset-password';
const REJECT: string = "/reject";
const APPROVE: string = "/approve";
const SUBMIT: string = "/submit";
const DELETE: string = "/delete";


const GET_REGIONS_PATH: string = REGIONS + GET_ALL
const GET_ORGANIZATIONS_PATH: string = ORGANIZATIONS + GET_ALL
const LOGIN_PATH: string = USER + AUTH + LOGIN
const CREATE_NEW_PROGRAM_PATH: string = PROGRAM + CREATE_NEW
const GET_PROGRAMS_PATH: string = PROGRAM + GET_ALL


export { 
    MONEVI_BASE_URL,
    GET_REGIONS_PATH,
    GET_ORGANIZATIONS_PATH,
    LOGIN_PATH,
    CREATE_NEW_PROGRAM_PATH,
};


class MoneviPath {
    
    static GET_ORGANIZATIONS_PATH = ORGANIZATIONS + GET_ALL;
    static CREATE_NEW_ORGANIZATION_PATH = ORGANIZATIONS + CREATE_NEW;
    static REQUEST_RESET_PASSWORD_PATH = USER + AUTH + REQUEST_RESET_PASSWORD;
    static RESET_PASSWORD_PATH = USER + AUTH + RESET_PASSWORD;
    static REGISTER_STUDENT_PATH = USER + REGISTER + STUDENT;
    static GET_STUDENTS_PATH = USER + FIND_ALL_STUDENT;
    static APPROVE_STUDENT_PATH = USER + SUPERVISOR + APPROVE_STUDENT;
    static DECLINE_STUDENT_PATH = USER + SUPERVISOR + DECLINE_STUDENT;

}


export { MoneviPath };