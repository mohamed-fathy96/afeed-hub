import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Logo from "@app/assets/images/logo.png";

//assets
// import logo from '@app/assets/images/header-logo.png';
//actions
import { setLoginUser } from "@app/store/auth/AuthSlice";
//selectors
import { getIsLoginLoading } from "@app/store/auth/AuthSelectors";
import { useAppDispatch, useAppSelector } from "@app/lib/hooks/useStore";
import { InputField } from "@app/ui/InputField";
import AuthLayout from "@app/components/layout/auth/layout";
import { AuthThemeToggle } from "@app/components/layout/auth/ThemeToggle";
import { Button } from "@app/ui/Button";
import { Icon } from "@app/ui/Icon";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => getIsLoginLoading({ state }));

  // Custom validation schema for @afeed.co domain
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .matches(
        /@afeed\.co$/,
        "Only team members with @afeed.co email addresses can access this portal"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik form handling
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(setLoginUser(values)).unwrap();
      } catch (error) {
        // Error handling is done in the slice with toast
      }
    },
  });

  // Auto-focus on first input
  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formik.isValid && formik.dirty) {
      formik.handleSubmit();
    }
  };

  return (
    <AuthLayout>
      {/* Header with Theme Toggle */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 bg-white px-1 rounded-xl shadow-lg flex items-center justify-center border border-gray-100">
            <img
              src={Logo}
              alt="No Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-base-content">Afeed Hub</h1>
            <p className="text-sm text-gray-500">Management Center</p>
          </div>
        </div>
        <AuthThemeToggle />
      </div>

      {/* Welcome Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-base-content mb-3">
          Staff Login
        </h2>
        <p className="text-gray-600 text-lg">
          Sign in with your{" "}
          <span className="font-medium" style={{ color: "#196FF0" }}>
            @afeed.co
          </span>{" "}
          account
        </p>
      </div>

      {/* Login Form */}
      <form className="space-y-7" onSubmit={formik.handleSubmit}>
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-base-content mb-3"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon icon="lucide:mail" className="h-5 w-5 text-gray-400" />
            </div>
            <InputField
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="your.name@afeed.co"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyPress={handleKeyPress}
              className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base ${
                formik.touched.email && formik.errors.email
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 focus:ring-2"
              }`}
              style={
                {
                  "--tw-ring-color":
                    formik.touched.email && !formik.errors.email
                      ? "#f43f6e"
                      : undefined,
                  borderColor:
                    formik.touched.email && !formik.errors.email
                      ? "#f43f6e"
                      : undefined,
                } as React.CSSProperties
              }
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex items-center">
                <Icon
                  icon="lucide:alert-circle"
                  className="w-4 h-4 mr-2 flex-shrink-0"
                />
                {formik.errors.email}
              </p>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-base-content mb-3"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon icon="lucide:lock" className="h-5 w-5 text-gray-400" />
            </div>
            <InputField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyPress={handleKeyPress}
              className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-base ${
                formik.touched.password && formik.errors.password
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 focus:ring-2"
              }`}
              style={
                {
                  "--tw-ring-color":
                    formik.touched.password && !formik.errors.password
                      ? "#f43f6e"
                      : undefined,
                  borderColor:
                    formik.touched.password && !formik.errors.password
                      ? "#f43f6e"
                      : undefined,
                } as React.CSSProperties
              }
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              <Icon
                icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                className="h-5 w-5"
              />
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex items-center">
                <Icon
                  icon="lucide:alert-circle"
                  className="w-4 h-4 mr-2 flex-shrink-0"
                />
                {formik.errors.password}
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            loading={isLoading}
            disabled={!formik.isValid || !formik.dirty || isLoading}
            color="primary"
            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold  focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Icon
                  icon="lucide:loader-2"
                  className="animate-spin w-5 h-5 mr-3"
                />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <Icon icon="lucide:log-in" className="w-5 h-5 mr-3" />
                Login
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
            <Icon icon="lucide:shield-check" className="w-4 h-4 mr-2" />
            <span>Secure access for Afeed staff only</span>
          </div>
          <p className="text-xs text-gray-400">
            Having trouble? Contact your Technology Team
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
