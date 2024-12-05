'use client'
import { useEffect, useState } from "react";
import { permanentRedirect, useSearchParams } from "next/navigation"; // For accessing query params


export default function VerifyRequest() {
  const [isClient, setIsClient] = useState(false); // State to track if we're on the client side
  const [message, setMessage] = useState("Wait a moment, we are verifying you...");
  const [status, setStatus] = useState(null); // Tracks success or error status
  const searchParams = useSearchParams(); // Hook to get query parameters from the URL


  // Set isClient to true when the component has mounted (client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure useRouter is used after component has mounted (client-side)
  useEffect(() => {
    if (!isClient) return; // Don't run if it's not client-side

    const verifyUser = async () => {
      const token = searchParams.get("token"); // Get token from the URL

      if (!token) {
        setMessage("Token is missing. Verification cannot proceed.");
        setStatus("error");
        return;
      }

      try {
        // Send the token to the verification endpoint
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || "Verification successful!");
          setStatus("success");
          // Update the URL using replaceState (without reloading the page)
          permanentRedirect('/dashboard');
       
        } else {
          setMessage(data.message || "Verification failed. Invalid or expired token.");
          setStatus("error");
          // Update the URL to avoid showing the token in the URL bar
          permanentRedirect('/auth/signup');
         
        }
      } catch (error) {
        console.error("Error during verification:", error);
        setMessage("An error occurred during verification. Please try again later.");
        setStatus("error");
        // Update the URL to avoid showing the token in the URL bar
        permanentRedirect('/auth/signup');
   
      }
    };

    // Run the verification process
    verifyUser();
  }, [isClient, searchParams]); // Ensure this effect runs on the client side

  if (!isClient) {
    return null; // Avoid rendering anything on the server side
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Email Verification</h1>
      <p>{message}</p>
      {status === "success" && <p>Thank you for verifying your email!</p>}
      {status === "error" && <p>If the issue persists, please contact support.</p>}
    </div>
  );
}
