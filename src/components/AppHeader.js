import { signOut } from "next-auth/react";
import styled, { keyframes } from "styled-components";

const AppHeader = () => {
  return (
    <div className="bg-stone-200 py-2 px-4 w-full">
      <div className="container mx-auto flex items-center justify-between">
        <div></div>
        <div>
          <AnimatedGradientText>AuxDaddy</AnimatedGradientText>
        </div>
        <div>
          <button
            onClick={() => signOut()}
            className="bg-stone-800 text-white px-4 py-2 rounded"
          >
            Log out
          </button>
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
