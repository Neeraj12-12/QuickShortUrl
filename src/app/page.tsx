"use client";
import React, { useState } from 'react';
import { Link, ChevronDown, ChevronUp } from 'lucide-react';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleShorten = async () => {
    if (!originalUrl) return;
    setLoading(true);
    try {
      const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    
      const response = await fetch(`${BASE_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl,
          customSlug,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      });
    
      if (response.ok) {
        const data = await response.json();
        const urlParts = data.shortUrl.split('/');
        const shortCode = urlParts[urlParts.length - 1];
        const originalUrl = `${BASE_URL}/api/getUrl/${shortCode}`;
        setShortenedUrl(originalUrl);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">URL Shortener</h1>
        <div className="mb-6">
          <label htmlFor="originalUrl" className="block text-gray-700 font-medium mb-2">
            Original URL
          </label>
          <input
            type="url"
            id="originalUrl"
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter your long URL"
            required
          />
        </div>

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

        {showOptionalFields && (
          <div className="space-y-6 mb-6 animate-fade-in">
            <div>
              <label htmlFor="customSlug" className="block text-gray-700 font-medium mb-2">
                Custom Slug (Optional)
              </label>
              <input
                type="text"
                id="customSlug"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="Enter custom slug"
              />
            </div>

            <div>
              <label htmlFor="expiresAt" className="block text-gray-700 font-medium mb-2">
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
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md w-full mb-4"
          onClick={handleShorten}
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {shortenedUrl && (
          <div className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2">
            <span className="text-gray-700 overflow-x-auto">{shortenedUrl}</span>
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-600 flex items-center"
            >
              <Link className="w-5 h-5 mr-2" />
              Open
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;