import React, { useEffect, useRef } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { hoverScale } from "./DesignStandardize";

const CollapsibleContent = ({
  title,
  children,
  onToggle,
  isOpen,
  card,
  status,
}) => {
  const handleClick = () => {
    onToggle();
  };

  const handleOutsideClick = (event) => {
    const isOutsideClick = !contentRef.current.contains(event.target);
    if (isOutsideClick && isOpen) {
      onToggle();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const contentRef = useRef(null);

  return (
    <div className={`${card && "border-b-2 rounded-lg"}`} ref={contentRef}>
      <div
        className={`${
          card ? "bg-white" : "bg-gray-200 border border-gray-300"
        } flex items-center justify-between cursor-pointer p-1 transition-all duration-200 rounded-t-lg`}
        onClick={handleClick}
      >
        <p className="flex flex-row gap-1 text-transparent bg-clip-text bg-gradient-to-b from-[#6782e6] to-[#214DED] m-0 font-semibold">
          {title}
          {status ? (
            <div
              className={`w-3 h-3 hover:cursor-pointer ${hoverScale} my-auto rounded-full mr-2 bg-green-500`}
            />
          ) : (
            <div
              className={`w-3 h-3 hover:cursor-pointer ${hoverScale} my-auto rounded-full mr-2 bg-red-500`}
            />
          )}
        </p>
        {!card && isOpen && <ExpandLessIcon />}
      </div>
      <div
        className={`${
          card ? "bg-white" : "bg-gray-200 border border-t-0 border-gray-300"
        } p-1 transition-max-height duration-300 overflow-y-auto rounded-b-lg ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default CollapsibleContent;
