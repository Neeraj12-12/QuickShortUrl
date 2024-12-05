"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import UrlPreview from "./dashboard/UrlPreview";

const ShortnerForm = ({
  isOptionalVisible = false,
  setIsHistoryTabOpen,
  onChildApiSuccess,
}: {
  isOptionalVisible?: boolean;
  setIsHistoryTabOpen?: Dispatch<SetStateAction<boolean>>;
  onChildApiSuccess?: () => void;
}) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Add validation states
  const [urlError, setUrlError] = useState("");
  const [slugError, setSlugError] = useState("");

  // Validation constants
  const MAX_URL_LENGTH = 2048;
  const MIN_SLUG_LENGTH = 3;
  const MAX_SLUG_LENGTH = 20;
  const SLUG_PATTERN = /^[a-zA-Z0-9-_]+$/;

  // URL validation function
  const validateUrl = (url) => {
    setUrlError("");

    if (!url) {
      setUrlError("URL is required");
      return false;
    }

    if (url.length > MAX_URL_LENGTH) {
      setUrlError(`URL must be less than ${MAX_URL_LENGTH} characters`);
      return false;
    }

    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        setUrlError("URL must start with http:// or https://");
        return false;
      }
    } catch (e) {
      setUrlError("Please enter a valid URL");
      return false;
    }

    return true;
  };

  // Slug validation function
  const validateSlug = (slug) => {
    setSlugError("");

    if (!slug) return true;

    if (slug.length < MIN_SLUG_LENGTH) {
      setSlugError(`Slug must be at least ${MIN_SLUG_LENGTH} characters`);
      return false;
    }

    if (slug.length > MAX_SLUG_LENGTH) {
      setSlugError(`Slug must be less than ${MAX_SLUG_LENGTH} characters`);
      return false;
    }

    if (!SLUG_PATTERN.test(slug)) {
      setSlugError(
        "Slug can only contain letters, numbers, hyphens, and underscores"
      );
      return false;
    }

    return true;
  };

  const handleReset = () => {
    setOriginalUrl("");
    setCustomSlug("");
    setExpiresAt("");
    setShortenedUrl("");
    setUrlError("");
    setSlugError("");
    setShowOptionalFields(false);
    setShowPreview(false);
  };

  const toggleHistoryTab = () => {
    if (setIsHistoryTabOpen) {
      setIsHistoryTabOpen((prev) => !prev);
    }
  };
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setOriginalUrl(url);
    if (url) validateUrl(url);
  };

  const handleSlugChange = (e) => {
    const slug = e.target.value;
    setCustomSlug(slug);
    if (slug) validateSlug(slug);
  };

  const handleShorten = async () => {
    const isUrlValid = validateUrl(originalUrl);
    const isSlugValid = validateSlug(customSlug);

    if (!isUrlValid || !isSlugValid) return;

    setLoading(true);
    try {
      
 
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: null,
          originalUrl,
          customSlug,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const urlParts = data.shortUrl.split("/");
        const shortCode = urlParts[urlParts.length - 1];
        const originalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`;
        setShortenedUrl(originalUrl);

        if (onChildApiSuccess) onChildApiSuccess();
      } else {
        console.error("Error creating shortened URL");
      }
    } catch (error) {
      console.error("Request failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-start p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Shorten Your URL
          </h1>
          <div className="mb-6">
            <label
              htmlFor="originalUrl"
              className="block text-gray-700 font-medium mb-2"
            >
              Original URL
            </label>
            <input
              type="url"
              id="originalUrl"
              className={`border rounded-md px-4 py-2 w-full focus:outline-none focus:ring ${
                urlError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              value={originalUrl}
              onChange={handleUrlChange}
              placeholder="Enter your long URL (e.g., https://example.com)"
              required
            />
            {urlError && (
              <p className="mt-1 text-red-500 text-sm">{urlError}</p>
            )}
          </div>

          {isOptionalVisible && (
            <button
              className="text-purple-500 hover:text-purple-600 flex items-center mx-auto mb-4"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
            >
              {showOptionalFields ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide advanced options
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show advanced options
                </>
              )}
            </button>
          )}

          {showOptionalFields && (
            <div className="space-y-6 mb-6 animate-fade-in">
              <div>
                <label
                  htmlFor="customSlug"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Custom Slug (Optional)
                </label>
                <input
                  type="text"
                  id="customSlug"
                  className={`border rounded-md px-4 py-2 w-full focus:outline-none focus:ring ${
                    slugError
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  value={customSlug}
                  onChange={handleSlugChange}
                  placeholder="Enter custom slug (e.g., my-link)"
                />
                {slugError && (
                  <p className="mt-1 text-red-500 text-sm">{slugError}</p>
                )}
                <p className="mt-1 text-gray-400 text-xs">
                  {`Note: ${MIN_SLUG_LENGTH}-${MAX_SLUG_LENGTH} characters, letters, numbers, hyphens, and underscores only`}
                </p>
              </div>

              <div>
                <label
                  htmlFor="expiresAt"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Expiry Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            className={`text-white font-medium py-2 px-4 rounded-md w-full mb-4 ${
              loading || urlError || slugError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600"
            }`}
            onClick={handleShorten}
            disabled={loading || !!urlError || !!slugError}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>

          {shortenedUrl && (
            <UrlPreview
              shortenedUrl={shortenedUrl}
              setShowPreview={setShowPreview}
            />
          )}

          <div className="flex mt-8">
            {isOptionalVisible && (
              <button
                className="text-white font-medium py-2 px-4 rounded-md w-full mb-4 bg-purple-500 hover:bg-purple-600 mr-4"
                onClick={toggleHistoryTab}
              >
                History Urls
              </button>
            )}
            <button
              className="text-white font-medium py-2 px-4 rounded-md w-full mb-4 bg-purple-500 hover:bg-purple-600"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {shortenedUrl && showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-[50vh] overflow-auto">
              <div className="flex items-center justify-between bg-gray-100 rounded-t-lg px-4 py-2">
                <span className="text-gray-700 font-medium">
                  Shortened URL Preview
                </span>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShortenedUrl("")}
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <iframe
                  src={shortenedUrl}
                  className="w-full h-full"
                  title="Shortened URL Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShortnerForm;
