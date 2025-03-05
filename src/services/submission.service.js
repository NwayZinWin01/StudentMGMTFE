import axios from "axios";

const API_URL = "https://localhost:7246/api/Students/";

class SubmissionService {
    GetAll() {
        return axios.get(API_URL + "GetAll");
    }

    SaveOrUpdate(submission) {
        console.log("save in service",submission)
        return axios.post(API_URL + "SaveOrUpdate", submission);
    }
}

export default new SubmissionService();

