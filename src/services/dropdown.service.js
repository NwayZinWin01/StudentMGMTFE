// import axios from "@/services/api"
import axios from "axios";

const API_URL = "https://localhost:7246/api/dropdown/";



class dropdownservice {
    GetDeptList() {      
        return axios.get(API_URL + "GetDepartmentList");
    }
    GetTeacherlist() {      
        return axios.get(API_URL + "GetTeacherList");
    }
    GetCourseList() {     
        return axios.get(API_URL + "GetCourseList");
    }
    GetStudentList() {      
        return axios.get(API_URL + "GetStudentList");
    }
}

export default new dropdownservice();

