import React, { useState, useEffect } from "react";
import axios from "axios";
import "./fieldBuilder.css";
import Button from "../Button/Button";
import CloseIcon from "@mui/icons-material/Close";

const FieldBuilder = () => {
  const storedFormData = JSON.parse(localStorage.getItem("form-data")) || {};
  const storedLabel = storedFormData?.label || "";
  const storedIsMultiValued = storedFormData?.isMultiValued || false;
  const storedDefaultValue = storedFormData?.defaultValue || "";
  const storedChoice = storedFormData?.choice || "";
  const storedChoices = storedFormData?.choices || [];
  const storedOrder = storedFormData?.order || "alphabetic";

  const [label, setLabel] = useState(storedLabel);
  const [isMultiValued, setIsMultiValued] = useState(storedIsMultiValued);
  const [defaultValue, setDefaultValue] = useState(storedDefaultValue);
  const [choice, setChoice] = useState(storedChoice);
  const [choices, setChoices] = useState(storedChoices);
  const [order, setOrder] = useState(storedOrder);

  const [labelError, setLabelError] = useState(false);
  const [newChoiceErr, setNewChoiceErr] = useState("");
  const [choiceError, setChoiceError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Update local storage whenever any of the form data changes
  useEffect(() => {
    localStorage.setItem(
      "form-data",
      JSON.stringify({
        label,
        isMultiValued,
        defaultValue,
        choices,
        choice,
        order,
      })
    );
  }, [label, isMultiValued, defaultValue, choices, order, choice]);

  // Clear all errors
  const clearErrors = () => {
    setLabelError(false);
    setChoiceError("");
    setNewChoiceErr("");
  };

  // Handle Clear Button
  const handleClearButton = () => {
    setLabel("");
    setIsMultiValued(false);
    setDefaultValue("");
    setChoices([]);
    setOrder("alphabetic");
    setChoice("");

    clearErrors();
  };

  // Handle all Input Validations
  const handleInputValidation = () => {
    if (label === "") {
      setLabelError(true);
    }
  };

  // Handle Submit Button
  const handleSubmit = async () => {
    setIsLoading(true);
    handleInputValidation();

    // If there is error in input validation, we return
    if (labelError || choiceError) {
      setIsLoading(false);
      return;
    }

    let updatedChoices = choices;
    if (!choices.includes(defaultValue) && choices.length == 50) {
      setChoiceError("You cannot have more than 50 choices");
      setIsLoading(false);
      return;
    } else if (defaultValue != "" && !choices.includes(defaultValue)) {
      updatedChoices = [...choices, defaultValue];
      setChoices(updatedChoices);
    }

    const payload = {
      label,
      isMultiValued,
      defaultValue,
      choices: updatedChoices,
      order,
    };

    try {
      const response = await axios.post(
        "http://www.mocky.io/v2/566061f21200008e3aabd919",
        payload
      );
      console.log("Response:", response);
    } catch (error) {
      setIsLoading(false);
      console.log("Error:", error?.message || error);
    }

    setIsLoading(false);
    console.log("Submitted Data");
    console.log(payload);
  };

  const handleNewChoice = (e) => {
    if (e.key == "Enter" && choice.length > 0) {
      const updatedChoice = choice.slice(0, 40);

      if (choices.includes(updatedChoice)) {
        setNewChoiceErr("*Cannot enter duplicate choices");
        return;
      } else if (choices.length >= 50) {
        setNewChoiceErr("*Cannot add more than 50 choices");
        return;
      }

      setChoices([...choices, updatedChoice]);
      setChoice("");
      setNewChoiceErr("");
    }
  };

  const removeChoice = (index) => {
    const updatedChoices = choices.filter((el, idx) => index != idx);
    setChoices(updatedChoices);

    if (updatedChoices.length <= 50) {
      setNewChoiceErr("");
      setChoiceError("");
    }
  };

  return (
    <div className="container">
      <div className="field-header">
        <h2>Field Builder</h2>
      </div>
      <div className="field-body">
        <div className="content">
          <div className="input-container">
            <div className="left">
              <label htmlFor="label">Label</label>
            </div>
            <div className="right">
              <div className="label-container">
                <input
                  type="text"
                  placeholder="Enter Label"
                  onInput={(e) => setLabel(e.target.value)}
                  value={label}
                  id="label"
                />
                {labelError && (
                  <p className="error">*Value for label is required</p>
                )}
              </div>
            </div>
          </div>
          <div className="input-container type-container">
            <div className="left">
              <label htmlFor="type">Type</label>
            </div>
            <div className="right">
              <span>Multi-select</span>
              <input
                type="checkbox"
                name="type"
                id="type"
                checked={isMultiValued}
                onChange={() => setIsMultiValued(!isMultiValued)}
              />
              <span>(A value is required)</span>
            </div>
          </div>
          <div className="input-container default-container">
            <div className="left">
              <label htmlFor="val">Default Value</label>
            </div>
            <div className="right">
              <div className="default-container">
                <input
                  id="val"
                  type="text"
                  placeholder="Enter default value"
                  onInput={(e) => setDefaultValue(e.target.value)}
                  value={defaultValue}
                />
              </div>
            </div>
          </div>

          <div className="input-container">
            <div className="left">
              <label htmlFor="choices">Enter new choice</label>
            </div>
            <div className="right">
              <div className="choice-container">
                <input
                  id="val"
                  type="text"
                  placeholder="Enter new choice"
                  onInput={(e) => setChoice(e.target.value)}
                  onKeyDown={handleNewChoice}
                  value={choice}
                />
                {newChoiceErr && <p className="error">{newChoiceErr}</p>}
                {choice.length > 40 && (
                  <p className="error">
                    Exceeded characters: {choice.length - 40}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="input-container">
            <div className="left">
              <label htmlFor="choices">Choices</label>
            </div>
            <div className="right">
              <div className="your-choice-container">
                {choices.map((choice, idx) => (
                  <div className="you-choice-element" key={idx}>
                    <p>{choice}</p>
                    <CloseIcon
                      style={{ fontSize: 16, color: "red", cursor: "pointer" }}
                      onClick={() => removeChoice(idx)}
                    />
                  </div>
                ))}
              </div>
              {choiceError && <p className="error">{choiceError}</p>}
            </div>
          </div>
          <div className="input-container order-container">
            <div className="left">
              <label htmlFor="order">Order</label>
            </div>
            <div className="right">
              <select
                name="order"
                id="order"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="alphabetic">
                  Display choices in alphabetic order
                </option>
                <option value="reverse-alphabetic">
                  Display choices in reverse alphabetic order
                </option>
              </select>
            </div>
          </div>
          <div className="buttons">
            <Button
              buttonType="submit"
              handleClick={handleSubmit}
              buttonClassName="submit-button"
              buttonText="Save Changes"
              isLoading={isLoading}
            />
            <Button
              handleClick={handleClearButton}
              buttonClassName="clear-button"
              buttonText="Clear"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldBuilder;
