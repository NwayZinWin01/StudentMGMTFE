import axios from "axios";

const API_URL = "https://localhost:7246/api/Assignment/";

class AssignmentService {
    GetAll() {
        return axios.get(API_URL + "GetAll");
    }
    GetById(id) {
        console.log("getbyid",id)
        return axios.get(API_URL +`GetById?id=` +id);
    }
    Delete(id){
        console.log("delete in service",id)
        return axios.delete(API_URL +"delete?id=" +id);
      }
    SaveOrUpdate(assignment) {
        console.log("save in service",assignment)
        return axios.post(API_URL + "SaveOrUpdate", assignment);
    }
}

export default new AssignmentService();

