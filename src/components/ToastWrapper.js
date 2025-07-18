'use client';

import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';

const ToastifyCSS = dynamic(
  () => import('react-toastify/dist/ReactToastify.css'),
  { ssr: false }
);

export default function ToastWrapper() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      toastClassName="!rounded-lg !shadow-md !w-fit !min-w-[200px] !max-w-[80vw] !px-4 !py-2 !text-sm !text-gray-800 !bg-white"
      bodyClassName="!text-sm"
    />
  );
}