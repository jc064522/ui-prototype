import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import NumericInput from "./NumericInput";
import { Input } from "semantic-ui-react";

import "./NumericInput.css";

storiesOf("NumericInput", module)
  .add("basic", () => (
    <div className="container">
      <NumericInput />
    </div>
  ))
  .add("with default value", () => (
    <div className="container">
      <NumericInput defaultValue={10}/>
    </div>
  ))
  .add("with placeholder value", () => (
    <div className="container">
      <NumericInput placeholder={11}/>
    </div>
  ))
  .add("with max value of 4", () => (
    <div className="container">
      <NumericInput max={4} value={2}/>
    </div>
  ))
  .add("with min value of -1", () => (
    <div className="container">
      <NumericInput min={-1} value={0}/>
    </div>
  ))
  .add("with min value of 42 and a max value of 46", () => (
    <div className="container">
      <NumericInput min={42} max={46} value={44}/>
    </div>
  ))
  .add("with value lower than min", () => (
    <div className="container">
      <NumericInput min={4} value={2}/>
    </div>
  ))
  .add("with value high than max", () => (
    <div className="container">
      <NumericInput max={4} value={6}/>
    </div>
  ))
