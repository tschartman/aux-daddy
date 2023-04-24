import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import styled, { keyframes } from "styled-components";

const AppHeader = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); 

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-stone-100 py-2 px-4 w-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-grow"></div>
        <div className="flex-shrink-0 pl-8">
          <AnimatedGradientText>AuxDaddy</AnimatedGradientText>
        </div>
        <div className="flex-grow flex justify-end relative"> {/* Add 'relative' class */}
          <button
            onClick={toggleDropdown}
            className="text-2xl px-4 py-2 focus:outline-none"
          >
            &#8942;
          </button>
          {dropdownVisible && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg"
            >
              <button
                onClick={() => signOut()}
                className="w-full text-left bg-white text-gray-800 px-4 py-2 hover:bg-gray-200 rounded-t"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const hue = keyframes`
 from {
   -webkit-filter: hue-rotate(0deg);
 }
 to {
   -webkit-filter: hue-rotate(-360deg);
 }
`;
const AnimatedGradientText = styled.h1`
  color: #f35626;
  background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${hue} 10s infinite linear;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-feature-settings: "kern";
  font-size: 48px;
  font-weight: 700;
  line-height: 48px;
  overflow-wrap: break-word;
  text-align: center;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
`;

export default AppHeader;
