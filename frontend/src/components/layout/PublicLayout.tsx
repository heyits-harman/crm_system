import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
