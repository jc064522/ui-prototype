import React, { Component } from "react";
import PropTypes from 'prop-types'

import "./App.css";
import {
  Grid,
  Segment,
  List,
  Accordion,
  Form,
  Label
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import NumericInput from './NumericInput'

const priorityOptions = [
  { key: "1", value: "1", text: "1" },
  { key: "2", value: "2", text: "2" },
  { key: "3", value: "3", text: "3" },
  { key: "4", value: "4", text: "4" },
  { key: "5", value: "5", text: "5" },
  { key: "6", value: "6", text: "6" },
  { key: "7", value: "7", text: "7" },
  { key: "8", value: "8", text: "8" },
  { key: "9", value: "9", text: "9" },
  { key: "10", value: "10", text: "10" }
];

class TrackerSummary extends Component {
  state = { activeIndex: 1, accordionHeader: "MORE" };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    const newHeader = activeIndex === index ? "MORE" : "LESS";
    this.setState({ activeIndex: newIndex });
    this.setState({ accordionHeader: newHeader });
  };
  render() {
    const { activeIndex, accordionHeader } = this.state;
    const tracker = this.props.tracker

    return (
      <Segment>
        <Label attached="top">
          {tracker.name}
        </Label>

        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              Created tasks up to <h3>{tracker.trackerMs}</h3>
            </Grid.Column>
            <Grid.Column width={4}>
              Of its total range this is <h3>{tracker.trackerPercentage}%</h3>
            </Grid.Column>
            <Grid.Column width={4}>
              It last polled the stream <h3>{tracker.lastPollAge} hours ago</h3>
            </Grid.Column>
            <Grid.Column width={1}>
              <div className="headerDivider" />
            </Grid.Column>

            <Grid.Column width={3}>
              <Form>
                <Form.Checkbox inline label="Enabled?" checked={tracker.enabled} toggle />
                <Form.Field>
                  <label>Priority</label>
                  <NumericInput min={0} max={99} value={tracker.priority} />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Accordion fluid className="details-accordion">
              <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={this.handleClick}
              >
                <div className="details-accordion-title">{accordionHeader}</div>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <Grid>
                  <Grid.Column width={8}>
                    <List>
                      <List.Item>
                        <List.Icon name="tasks" />
                        <List.Content>has 3 tasks.</List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="tasks" />
                        <List.Content>is working on 3 streams.s</List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <List>
                      <List.Item>
                        <List.Icon name="star" />
                        <List.Content> has some events?</List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="star" />
                        <List.Content>
                          filter has no end time so it will never complete.
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid>
              </Accordion.Content>
            </Accordion>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
TrackerSummary.propTypes = {
  tracker: PropTypes.object.isRequired
}
export default TrackerSummary;
