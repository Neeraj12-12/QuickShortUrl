"use client";
import React from 'react';

import ShortnerForm from '@/app/components/ShortnerForm';


const UrlShortener = () => {
 
  return (
    <div className="h-screen bg-gradient-to-br from-purple-500 to-indigo-500">   
      <ShortnerForm/>
    </div>
  );
};

export default UrlShortener;