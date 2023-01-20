const MONEVI_BASE_URL: string = "http://localhost:8080/api/monevi";
const REGIONS: string = "/region";
const ORGANIZATIONS: string = "/organization";
const USER: string = "/user";
const SUPERVISOR: string = "/supervisor";
const STUDENT: string = "/student";
const PROGRAM: string = "/program";
const REPORT: string = "/report";
const TRANSACTION: string = "/transaction";
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
const SUMMARIZE: string = "/summarize";



const GET_REGIONS_PATH: string = REGIONS + GET_ALL
const GET_ORGANIZATIONS_PATH: string = ORGANIZATIONS + GET_ALL
const LOGIN_PATH: string = USER + AUTH + LOGIN
const CREATE_NEW_PROGRAM_PATH: string = PROGRAM + CREATE_NEW


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
    static GET_REGIONS_PATH = REGIONS + GET_ALL;
    static REQUEST_RESET_PASSWORD_PATH = USER + AUTH + REQUEST_RESET_PASSWORD;
    static RESET_PASSWORD_PATH = USER + AUTH + RESET_PASSWORD;
    static REGISTER_STUDENT_PATH = USER + REGISTER + STUDENT;
    static LOGIN_PATH = USER + AUTH + LOGIN;
    static GET_STUDENTS_PATH = USER + FIND_ALL_STUDENT;
    static APPROVE_STUDENT_PATH = USER + SUPERVISOR + APPROVE_STUDENT;
    static DECLINE_STUDENT_PATH = USER + SUPERVISOR + DECLINE_STUDENT;
    static REJECT_REPORT_PATH = REPORT + REJECT;
    static APPROVE_REPORT_PATH = REPORT + APPROVE;
    static SUMMARIZE_REPORT_PATH = REPORT + SUMMARIZE;
    static SUBMIT_REPORT_PATH = REPORT + SUBMIT;
    static GET_TRANSACTIONS_PATH = TRANSACTION + GET_ALL;
    static CREATE_NEW_TRANSACTION_PATH = TRANSACTION + CREATE_NEW;
    static DELETE_TRANSACTION_PATH = TRANSACTION + DELETE;
    static CREATE_PROGRAM_PATH = PROGRAM + CREATE_NEW;
    static GET_PROGRAMS_PATH = PROGRAM + GET_ALL

}


export { MoneviPath };