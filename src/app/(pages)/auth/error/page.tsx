"use client";

import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/auth/signin"); // Adjust the route if your login page is elsewhere
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg mb-6">It seems you're not authorized to view this page.</p>
      <button
        onClick={handleLoginRedirect}
        className="px-6 py-3 bg-purple-600 text-white font-medium rounded-md shadow-md hover:bg-purple-700"
      >
        Go to Login
      </button>
    </div>
  );
};

export default ErrorPage;
