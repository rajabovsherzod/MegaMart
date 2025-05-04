import { React, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import CategoriesSerivce from "../../service//category";
import { useDispatch } from "react-redux";
import {
  getCategoriesStart,
  getCategoriesSuccess,
  getCategoriesFailure,
} from "../../slice/categorySlice";

const Category = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      dispatch(getCategoriesStart());
      try {
        const response = await CategoriesSerivce.getCategories();
        console.log("Category response: ", response);
        dispatch(getCategoriesSuccess(response.data));
      } catch (error) {
        console.log("Error getting categories:", error);
        dispatch(getCategoriesFailure(error.message));
      }
    };

    fetchCategories();
  }, [dispatch]);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="rounded-full focus:outline-none w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1 border-r-5 bg-primary text-white rounded shadow hover:bg-primary/90 transition text-base sm:text-sm">
            Menu
          </button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
};

export default Category;
