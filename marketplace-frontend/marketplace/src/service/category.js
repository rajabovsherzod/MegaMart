import axios from "./api";

const CategoriesSerivce = {
    async getCategories(){
        const response = await axios.get("/categories");
        return response.data;
    }
}

export default CategoriesSerivce