"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import { AuthContainer, Input } from "@/app/others/utils/helperFunc";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Added for email confirmation state
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.userName) {
      newErrors.userName = "Name is required";
    } else if (formData.userName.length < 2) {
      newErrors.userName = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Send signup data to the API (handled by NextAuth)
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    
      if (response.ok) {
        // Redirect to login page after successful signup
        setEmailSent(true); // Set email sent flag to true
        setTimeout(() => router.replace("/auth/login"), 3000); // Redirect after 3 seconds
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || "Signup failed" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  } 

  return (
    <AuthContainer
      title="Create your account"
      subtitle="Start your journey with us"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            icon={User}
            type="text"
            placeholder="Full name"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            error={errors.userName}
          />

          <Input
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
          />

          <div className="relative">
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <Input
            icon={Lock}
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
          />
        </div>

        {errors.submit && (
          <p className="text-center text-red-500 text-sm">{errors.submit}</p>
        )}
        {emailSent && (
          <p className="text-center text-green-500 text-sm">
            Check your inbox for a verification email.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent 
              text-sm font-medium rounded-md text-white 
              ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
        >
          {loading ? (
            "Creating account..."
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.replace("/auth/login")}
            className="text-black underline font-medium rounded-lg text-sm py-2.5 text-center me-2 mb-2"
          >
            Login
          </button>
        </p>
      </form>
    </AuthContainer>
  );
};

export default Signup;