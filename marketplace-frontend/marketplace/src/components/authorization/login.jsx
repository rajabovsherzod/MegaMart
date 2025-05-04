import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AuthService from "../../service/auth";
import { signUserSuccess } from "../../slice/authSlice";
import Toast from "../../ui/toast/toast";
import { setItem } from "../../helpers/persistance-storage";

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    bgColor: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = { ...formData };
    try {
      const response = await AuthService.userLogin(user);
      if (response?.success && response?.token) {
        setItem("token", response.token);
        dispatch(
          signUserSuccess({
            user: response.user,
          })
        );
        sessionStorage.setItem("hasLoggedIn", "true");
        sessionStorage.setItem("currentPath", window.location.pathname);
        setIsAnimating(false);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 300);
      }
    } catch (error) {
      setToast({
        show: true,
        message: response?.error,
        bgColor: "bg-red-500",
      });
    }
    console.log(user);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 flex items-center justify-center">
      <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[440px] relative">
        <div
          className={`bg-white rounded-2xl w-full p-4 sm:p-6 relative transform transition-transform duration-300 ease-out ${
            isAnimating
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Handle bar for mobile */}
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>

          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome Back!
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Please sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Forgot Password & Remember Me */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-xs sm:text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm font-medium text-primary hover:text-primary-dark"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              Sign In
            </button>

            {/* Register Link */}
            <div className="text-center text-xs sm:text-sm">
              <span className="text-gray-500">Don't have an account?</span>{" "}
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setTimeout(onSwitchToRegister, 300);
                }}
                className="font-medium text-primary hover:text-primary-dark focus:outline-none focus:ring-0"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
