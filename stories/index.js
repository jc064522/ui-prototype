import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import NumericInput from "../src/NumericInput";
import { Input } from "semantic-ui-react";

import "./index.css";

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
  ));
;
;
