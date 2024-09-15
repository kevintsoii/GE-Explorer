import React from "react";

import MobileNavbarButton from "./MobileNavbarButton";
import LoginButton from "./LoginButton";

const MobileMenu = ({ isOpen, onClose, authUser }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="absolute right-0 top-0 h-full w-[65%] bg-white shadow-lg">
        <ul className="flex flex-col pt-6 px-4 gap-3">
          <MobileNavbarButton
            text="Areas"
            redirect="/areas"
            onClick={onClose}
          />
          <MobileNavbarButton
            text="Colleges"
            redirect="/colleges"
            onClick={onClose}
          />
          <MobileNavbarButton
            text="Courses"
            redirect="/courses"
            onClick={onClose}
          />

          <hr></hr>
          {authUser ? (
            <MobileNavbarButton
              text="Saved"
              redirect="/saved"
              onClick={onClose}
            />
          ) : (
            <LoginButton isMobile={true} />
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
