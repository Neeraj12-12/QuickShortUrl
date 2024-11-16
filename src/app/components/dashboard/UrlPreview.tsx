import { Copy, ExternalLink, Link, QrCode } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { toPng, toSvg } from "html-to-image";

function UrlPreview({ shortenedUrl, setShowPreview ,showShortnedUrl =true}) {
  const [qrDropdown, setQrDropdown] = useState(false);
  const qrRef = useRef(null);
  const dropdownRef = useRef(null); // Ref for dropdown container

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) // Check if the click is outside the dropdown
      ) {
        setQrDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownload = async (format) => {
    if (!qrRef.current) return;

    try {
      let dataUrl;

      // Generate the required format
      if (format === "png") {
        dataUrl = await toPng(qrRef.current);
      } else if (format === "svg") {
        dataUrl = await toSvg(qrRef.current);
      }

      // Create a link to download the file
      const link = document.createElement("a");
      if (dataUrl) link.href = dataUrl;
      link.download = `qrcode.${format}`;
      link.click();
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };
  return (
    <>
     {showShortnedUrl &&  <div className="">
        {shortenedUrl}
      </div>}
      <div className="relative flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 mt-4">
        <div className="flex overflow-auto items-center space-x-4 ">
          <a
            href={shortenedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-600 flex items-center"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Visit
          </a>
          <button
            className="text-purple-500 hover:text-purple-600 flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(shortenedUrl);
              alert("Shortened URL copied to clipboard!");
            }}
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy
          </button>
          <button
            className="text-purple-500 hover:text-purple-600 flex items-center"
            onClick={() => setShowPreview(true)}
          >
            <Link className="w-5 h-5 mr-2" />
            Preview
          </button>
          <div
            className="text-purple-500 hover:text-purple-600 flex items-center"
            onMouseEnter={() => setQrDropdown(true)}
            
          >
            <QrCode className="w-5 h-5 mr-2" />
            QR Code
            {qrDropdown && (
              <div
              ref={dropdownRef}
              onBlur={() => setQrDropdown(false)}
                onMouseLeave={() => setQrDropdown(false)}
                className="flex flex-col absolute top-0 rounded-lg shadow-lg shadow-slate-700 -right-10 bg-white border-2"
                style={{ textAlign: "center", margin: "20px" }}
              >
                <div
                  ref={qrRef}
                  style={{
                    background: "white",
                    padding: "16px",

                    width: "70px",
                  }}
                >
                  <QRCode value={shortenedUrl} size={70} />
                </div>
                <button
                  className="text-white font-medium py-2 px-2 rounded-md mt-4 mb-4 bg-purple-500 hover:bg-purple-600"
                  onClick={() => handleDownload("png")}
                  style={{ margin: "10px" }}
                >
                  Download as PNG
                </button>
                <button
                  className="text-white font-medium py-2 px-4 rounded-md  mb-4 bg-purple-500 hover:bg-purple-600"
                  onClick={() => handleDownload("svg")}
                  style={{ margin: "10px" }}
                >
                  Download as SVG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UrlPreview;
