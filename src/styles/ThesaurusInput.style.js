import { css, keyframes } from "react-emotion";

const input = css`
  height: 4rem;
  position: absolute;
  background-color: white;
  display: block;
  top: 40%;
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 51%;
  text-align: left;
  border-radius: 5px;
  z-index: -5;
  padding-left: 10px;
  &:focus {
    outline :0;
  }  
`;

const blink = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`;


const cursorBeforeElement = css`
  &::before {
    content: "";
    animation: ${blink} 1s linear infinite;
    padding: 0px;
    width: 1px;
    border: solid black 1px;
    position: absolute;
    height: 43px;
    box-sizing: border-box;
  };
`;

module.exports = {
  input,
  blink,
  cursorBeforeElement,
}