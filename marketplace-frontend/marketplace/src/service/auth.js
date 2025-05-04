import axios from "./api";

const AuthService = {
  async userRegister(data) {
    const response = await axios.post("/auth/register", data);
    return response.data;
  },
  async userLogin(data) {
    const response = await axios.post("/auth/login", data);
    return response.data;
  },
  async getUser() {
    const response = await axios.get("/auth/me");
    return response.data;
  },
};

export default AuthService;
