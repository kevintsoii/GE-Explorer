import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = document.documentElement.scrollTop;
      window.onscroll = function () {
        window.scrollTo(0, scrollY);
      };
    } else {
      window.onscroll = function () {};
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75"
      onClick={handleBackgroundClick}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg h-5/6 w-11/12 p-4 overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
