import React, { Component } from "react";
import PropTypes from "prop-types";

import { Input, Button, Icon, Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import "./NumericInput.css";

class NumericInput extends Component {
  componentWillMount () {
    const placeholder = this.props.placeholder ? this.props.placeholder : 0
    this.setState({placeholder})

    if(this.props.defaultValue){
      this.setState({ defaultValue: this.props.defaultValue });
    }

    if(this.props.value) {
      this.setState({ value: this.props.value });
    } 
  }

  handleUp = (e, upButtonProps) => {
    const noValueFallback = this.state.defaultValue ? this.state.defaultValue : this.state.placeholder
    const newValue = (this.state.value ? this.state.value : noValueFallback) + 1
    this.setState({ value: newValue });
  };
  
  handleDown = (e, downButtonProps) => {
    const noValueFallback = this.state.defaultValue ? this.state.defaultValue : this.state.placeholder
    const newValue = (this.state.value ? this.state.value : noValueFallback) - 1
    this.setState({ value: newValue });
  };

  render() {
    const { min, max, value, defaultValue, placeholder } = this.state;

    return (
      <div>
        <div className="row">
          <div className="input-row">
            <Input
              placeholder={placeholder}
              className="numeric-input"
              value={value}
              defaultValue={defaultValue ? defaultValue : null}
              action={
                <div>
                  <Button className="button-top" onClick={this.handleUp}>
                    <Icon name="angle up" />
                  </Button>
                  <Button className="button-bottom" onClick={this.handleDown}>
                    <Icon name="angle down" />
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

NumericInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.number
};

export default NumericInput;
