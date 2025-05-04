import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  signUserStart,
  signUserSuccess,
  signUserFailure,
} from "../../slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../service/auth.js";
import { setItem } from "../../helpers/persistance-storage";

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});

  // Add scrollbar hiding styles
  useEffect(() => {
    const styles = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username cannot exceed 20 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(signUserStart());
      const { username, email, password, terms } = formData;
      const user = { username, email, password, terms };
      try {
        const response = await AuthService.userRegister(user);
        if (response.success && response.token) {
          setItem("token", response.token);
          dispatch(
            signUserSuccess({
              user: response.user,
              token: response.token,
            })
          );
          handleClose();
          window.location.reload();
        }
      } catch (error) {
        console.log("Error response:", error.response?.data);
        console.log("Full error:", error);
        dispatch(
          signUserFailure(error.response?.data?.error || "Registration failed")
        );
      }
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 flex items-center justify-center">
      <div className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[440px] relative">
        <div
          className={`bg-white rounded-2xl w-full p-6 relative transform transition-transform duration-300 ease-out ${
            isAnimating
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
          style={{ maxHeight: "90vh" }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Handle bar for mobile */}
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1">
              Join MegaMart to start shopping
            </p>
          </div>

          {/* Scrollable content */}
          <div
            className="overflow-y-auto hide-scrollbar"
            style={{ maxHeight: "calc(90vh - 200px)" }}
          >
            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 text-sm border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

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
                  className={`mt-1 block w-full px-3 py-2 text-sm border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
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
                  className={`mt-1 block w-full px-3 py-2 text-sm border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 text-sm border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className={`h-4 w-4 text-primary focus:ring-primary border ${
                      errors.terms ? "border-red-500" : "border-gray-300"
                    } rounded`}
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary-dark"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-0 focus:ring-offset-0 transition-colors duration-200"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-sm mt-6">
            <span className="text-gray-500">Already have an account?</span>{" "}
            <button
              type="button"
              onClick={() => {
                handleClose();
                setTimeout(onSwitchToLogin, 300);
              }}
              className="font-medium text-primary hover:text-primary-dark focus:outline-none focus:ring-0"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
