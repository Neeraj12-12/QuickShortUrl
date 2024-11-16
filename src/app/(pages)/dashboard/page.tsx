"use client";
import React, { useEffect, useState } from "react";
import ShortnerForm from "../../components/ShortnerForm";

import { CircleX } from "lucide-react";
import UrlCard from "../../components/dashboard/UrlCard";
import { useSession } from "next-auth/react";

const DashBoard = () => {
  const [isHisoryTabOpen, setIsHisoryTabOpen] = useState(false);
  const [historyUrls, setHistoryUrls] = useState([]);
  const [trigger, setTrigger] = useState(false);

  const {data} = useSession();
  console.log(data)
  // Function to handle API success from the child
  const onChildApiSuccess = () => {
    setTrigger((prev) => !prev); // Toggle the trigger state
  };
  console.log("FADSFA",process.env.NEXT_PUBLIC_BASE_URL)
  useEffect(() => {
    const getHistory = async () => {
      const response = await fetch("/api/dashboard/getHistoryUrls");
      const data = await response.json();
      setHistoryUrls(data);
    };

    getHistory();
  }, [trigger]);
  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500">
      <ShortnerForm
        isOptionalVisible
        setIsHistoryTabOpen={setIsHisoryTabOpen}
        onChildApiSuccess={onChildApiSuccess}
      />
      {isHisoryTabOpen && (
        <>
          <div className=" absolute right-0 p-4 top-16 border-2 rounded-tl-xl rounded-bl-xl bg-white z-40 sm:w-1/2 h-screen w-2/3 overflow-auto">
            <div className="flex justify-between items-center text-center text-xl font-bold underline">
              History Urls
              <button onClick={() => setIsHisoryTabOpen(false)}>
                <CircleX size={36} color="#ee1111" absoluteStrokeWidth />
              </button>
            </div>

            {historyUrls.length > 0 ? (
              historyUrls.map((item, index) => {
                return  <UrlCard data={item} key={index}/>;
              })
            ) : (
              <div className="flex h-full w-full justify-center items-center">
                No Data
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashBoard;
