import axios from "axios";

const API_URL = "https://localhost:7246/api/Students/";

class StudentsService {
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
    SaveOrUpdate(student) {
        console.log("save in service",student)
        return axios.post(API_URL + "SaveOrUpdate", student);
    }
}

export default new StudentsService();

