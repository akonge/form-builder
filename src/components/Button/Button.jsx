import React from "react";
import "./button.css";

const Button = ({
  buttonType = "button",
  handleClick,
  buttonClassName,
  buttonText,
  isLoading = false,
}) => {
  return (
    <button
      type={buttonType}
      onClick={handleClick}
      className={`btn-button ${buttonClassName}`}
    >
      {isLoading ? "Loading.." : buttonText}
    </button>
  );
};

export default Button;
