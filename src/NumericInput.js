import React, { Component } from "react";
import PropTypes from "prop-types";

import { Input, Button, Icon, Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import "./NumericInput.css";

class NumericInput extends Component {
  componentWillMount () {
    if(this.props.value) {
      this.setState({ value: this.props.value });
    }

    this.setState({
      isDownDisabled: false,
      isUpDisabled: false
    }, () => this.setButtonDisabledStates())

  }

  setButtonDisabledStates = () => {
    if(this.props.max){
      if(this.state.value >= this.props.max){
        this.setState({isUpDisabled: true})
      }
      else {
        this.setState({isUpDisabled: false})
      }
    }

    if(this.props.min){
      if(this.state.value <= this.props.min){
        this.setState({isDownDisabled: true})
      }
      else {
        this.setState({isDownDisabled: false})
      }
    }
  }

  getFallBackValue(){
    let noValueFallback = this.props.defaultValue ? this.props.defaultValue : this.props.placeholder
    noValueFallback = noValueFallback ? noValueFallback : 0
    return noValueFallback
  }

  handleUp = (e, upButtonProps) => {
    const newValue = (this.state.value ? this.state.value : this.getFallBackValue()) + 1
    this.setState({ value: newValue }, () => this.setButtonDisabledStates());
  }
  
  handleDown = (e, downButtonProps) => {
    const newValue = (this.state.value ? this.state.value : this.getFallBackValue()) - 1
    this.setState({ value: newValue }, () => this.setButtonDisabledStates());
  }

  render() {
    const { value, isUpDisabled, isDownDisabled } = this.state;
    const { min, max, defaultValue, placeholder } = this.props
    return (
      <div>
        <div className="row">
          <div className="input-row">
            <Input
              size='mini'
              placeholder={placeholder ? placeholder : 0}
              className="numeric-input"
              value={value}
              defaultValue={defaultValue ? defaultValue : null}
              action={
                <div>
                  <Button className="button-top" onClick={this.handleUp} disabled={isUpDisabled}>
                    <Icon name="angle up" />
                  </Button>
                  <Button className="button-bottom" onClick={this.handleDown} disabled={isDownDisabled}>
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
  defaultValue: PropTypes.number,
  value: PropTypes.number
};

export default NumericInput;
