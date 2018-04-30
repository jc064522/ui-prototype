import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Grid,
  Segment,
  List,
  Accordion,
  Form,
  Label,
  Progress
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import NumericInput from "components/NumericInput";
import "./Tracker.css";

class Tracker extends Component {
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
    const tracker = this.props.tracker;

    const startMoment = moment().subtract(1, "days");
    const trackerMoment = moment(tracker.trackerMs);
    const now = moment();

    // TODO/FIXME: This is set to 1 because 0 is green. Semantis UI bug?
    let percentageComplete = 1;
    // If the last time the tracker created a batch of work is before our start moment
    // then we will report 0% complete for this view.
    if (startMoment.isBefore(trackerMoment)) {
      const completeMillis = startMoment.diff(trackerMoment);
      const totalMillis = trackerMoment.diff(now) + completeMillis;
      percentageComplete = completeMillis / totalMillis * 100;
    }

    return (
      <div>
        <Segment>
          <Label attached="top">{tracker.name}</Label>
          <Progress
            percent={percentageComplete}
            color="green"
            indicating
            size="small"
          />

          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                Created tasks up to <h3>{tracker.trackerMs}</h3>
              </Grid.Column>
              <Grid.Column width={4}>
                Of its total range this is <h3>{tracker.trackerPercentage}%</h3>
              </Grid.Column>
              <Grid.Column width={4}>
                It last polled the stream{" "}
                <h3>{tracker.lastPollAge} hours ago</h3>
              </Grid.Column>
              <Grid.Column width={1}>
                <div className="headerDivider" />
              </Grid.Column>

              <Grid.Column width={3}>
                <Form>
                  <Form.Checkbox
                    inline
                    label="Enabled?"
                    checked={tracker.enabled}
                    toggle
                  />
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
                  <div className="details-accordion-title">
                    {accordionHeader}
                  </div>
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
      </div>
    );
  }
}
Tracker.propTypes = {
  tracker: PropTypes.object.isRequired
};

export default Tracker;
