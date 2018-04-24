import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  Icon,
  Grid,
  Segment,
  Dropdown,
  Checkbox,
  Popup,
  Divider,
  List,
  Accordion,
  Form,
  Label
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

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

class App extends Component {
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

    return (
      <div className="App">
        <Grid>
          <Grid.Column width={16}>
            <header className="App-header">
              <h1 className="App-title">Stroom</h1>
            </header>
          </Grid.Column>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <Segment.Group>
              <Segment>
                {/* <Label color='green' floating>8%</Label>
      <br/><br/> */}

                <Label attached="top left">
                  FANTASTIC_PIPELINE_ALL_CAPS_FOR_SOME_REASON
                </Label>
                <Grid>
                  {/* <Grid.Row className="tracker-header">
                    <Grid.Column width={12} textAlign="left">
                      <h3>FANTASTIC_PIPELINE_ALL_CAPS_FOR_SOME_REASON</h3>
                    </Grid.Column>
                    <Grid.Column width={1}>
                      <Popup
                        trigger={<Checkbox toggle />}
                        content="Is this task enabled or not?"
                      />
                    </Grid.Column>

                    <Grid.Column width={3}>
                      <Popup
                        trigger={
                          <Dropdown
                            compact
                            floating
                            labeled
                            button
                            primary
                            color='blue'
                            icon="exclamation circle"
                            className="icon"
                            defaultValue={priorityOptions[0].value}
                            options={priorityOptions}
                          />
                        }
                        content="Select the priority for this task"
                      />
                    </Grid.Column>
                  </Grid.Row> */}
                  <Grid.Row>
                    <Grid.Column width={4}>
                      Created tasks up to <h3>2018-03-01 12:34:23</h3>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      Of it's total range this is <h3>8%</h3>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      It last polled the stream <h3>6.1 hours ago</h3>
                    </Grid.Column>
                    <Grid.Column width={1}>
                    <div class='headerDivider'></div>
                      {/* <Divider vertical content /> */}
                    </Grid.Column>

                    <Grid.Column width={3}>
                      <Grid.Row>
                        <Label pointing="right">Enabled</Label>
                        <Checkbox toggle />
                      </Grid.Row>
                      <Grid.Row>
                      <Label pointing="right">Priority</Label>
                        <Dropdown
                          compact
                          floating
                          // labeled
                          button
                          primary
                          label="Priority"
                          color="blue"
                          // icon="exclamation circle"
                          className="icon"
                          defaultValue={priorityOptions[0].value}
                          options={priorityOptions}
                        />
                      </Grid.Row>
                      {/* <Form>
                        <Form.Field>
                          <Label pointing="right">Enabled?</Label>
                          <Checkbox toggle />
                        </Form.Field>
                        <Form.Field>
                          <Dropdown
                            compact
                            floating
                            labeled
                            button
                            primary
                            label="Priority"
                            color="blue"
                            icon="exclamation circle"
                            className="icon"
                            defaultValue={priorityOptions[0].value}
                            options={priorityOptions}
                          />
                        </Form.Field>
                      </Form> */}
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
                                <List.Content>
                                  is working on 3 streams.s
                                </List.Content>
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
                                  filter has no end time so it will never
                                  complete.
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
              <Segment>
                <h3>FANTASTIC_PIPE_LINE_ALL_CAPS_FOR_SOME_REASON</h3>
                <p>Tracker MS: 2018-03-01T12:34:23:222Z</p>
                <p>Tracker %: 100</p>
                <p>Last poll age: 6.1h</p>
                <p>Task count: 3</p>
              </Segment>
              <Segment>
                <h3>FANTASTIC_PIPE_LINE_ALL_CAPS_FOR_SOME_REASON</h3>
                <p>Tracker MS: 2018-03-01T12:34:23:222Z</p>
                <p>Tracker %: 100</p>
                <p>Last poll age: 6.1h</p>
                <p>Task count: 3</p>
              </Segment>
              <Segment>
                <h3>FANTASTIC_PIPE_LINE_ALL_CAPS_FOR_SOME_REASON</h3>
                <p>Tracker MS: 2018-03-01T12:34:23:222Z</p>
                <p>Tracker %: 100</p>
                <p>Last poll age: 6.1h</p>
                <p>Task count: 3</p>
              </Segment>
              <Segment>
                <h3>FANTASTIC_PIPE_LINE_ALL_CAPS_FOR_SOME_REASON</h3>
                <p>Tracker MS: 2018-03-01T12:34:23:222Z</p>
                <p>Tracker %: 100</p>
                <p>Last poll age: 6.1h</p>
                <p>Task count: 3</p>
              </Segment>
              <Segment>
                <h3>FANTASTIC_PIPE_LINE_ALL_CAPS_FOR_SOME_REASON</h3>
                <p>Tracker MS: 2018-03-01T12:34:23:222Z</p>
                <p>Tracker %: 100</p>
                <p>Last poll age: 6.1h</p>
                <p>Task count: 3</p>
              </Segment>
            </Segment.Group>
          </Grid.Column>
          <Grid.Column width={4} />
        </Grid>
      </div>
    );
  }
}

export default App;
