// src/components/hooks/use-toast.ts
import { toast as reactToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function useToast() {
  return {
    toast: ({ description }: { description: string }) => {
      reactToast(description, {
        position: "top-center", // Pozitsiya
        autoClose: 3000, // Toast avtomatik yopilishi
        type: "success", // Toast turi
        className: "bg-blue-500 text-white shadow-lg", // Tailwind CSS yordamida dizayn
      });
    },
  };
}
