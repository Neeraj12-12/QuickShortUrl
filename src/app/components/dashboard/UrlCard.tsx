import { Badge, BadgeCheck, BadgeX } from "lucide-react";
import React from "react";
import UrlPreview from "./UrlPreview";

const UrlCard = ({ data }) => {

  return (
    <div className="flex-col justify-center items-center border-2  border-gray-700 p-4 rounded my-2">
      <div className="flex justify-left items-center">
        <div className="mr-2 font-semibold">Original URL: </div>
        <p className="overflow-y-auto  mx-4 flex justify-evenly text-gray-700  bg-gray-100 rounded-md px-4 py-2 ">{data.originalUrl}</p>
        
      </div>
      <div className="mt-3">
       
        <div className="space-y-2 ">
          {data.shortUrls.map((shortUrl, i) => {
            const date = new Date(shortUrl.createdAt);
            return (
              <div className="rounded-lg p-2 border-2 shadow-lg shadow-gray-600" key={i}>
                <div className=" font-medium"><p className="inline-block font-semibold mr-4">QuickUrl: </p><p className="inline-block  justify-evenly text-gray-700  bg-gray-100 rounded-md px-4 py-2">{process.env.NEXT_PUBLIC_BASE_URL+ "/" + shortUrl.shortCode}</p></div>
                <div className="flex font-semibold">
                  Active:
                  {shortUrl.expiresAt < new Date() ? (
                    <div className="flex font-normal">
                      Yes <BadgeCheck color="#0ad12b" size={24} />
                    </div>
                  ) : (
                    <div className="flex">
                      No <BadgeX color="#db1f32" size={24} />
                    </div>
                  )}
                </div>
                <div><p className="inline-block font-semibold">Expires: </p> <p className="inline-block">{shortUrl.expiresAt ?? "Never"}</p></div>
                <div> <p className="inline-block font-semibold">CreatedAt: </p> <p className="inline-block">{date.toString() ?? "Never"}</p></div>
                <UrlPreview shortenedUrl={shortUrl.shortCode} setShowPreview={()=> {}} showShortnedUrl ={false}/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UrlCard;
