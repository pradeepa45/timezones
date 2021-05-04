import React, { Component } from 'react'
import axios from 'axios'
import { Message, Icon, Segment, Form, Grid, Header, Container } from 'semantic-ui-react';


class App extends Component {
  constructor() {
    super();
    this.state = {
      timezones: [],
      dataFetched: false,
      selectedTimezone: null,
      currentTimeInTimezone: null
    }
  }

  componentDidMount() {
    const apiUrl1 = 'http://worldtimeapi.org/api/timezones'
    axios.get(apiUrl1)
      .then((response) => {
        // console.log(response.data);
        this.setState({
          dataFetched: true,
          timezones: response.data
        })
      })
      .catch(error => {
        console.log('error', error)
      })
  }

  updateSelectedTimeZone = (event, value) => {
    // console.log(value.value);
    this.setState({
      selectedTimezone: value.value
    }, () => {
      var box1 = document.getElementById('selectedTimezone');
      // console.log(box1);
      box1.value = this.state.selectedTimezone;
      const apiUrl2 = 'https://worldtimeapi.org/api/timezone/'
      axios.get(apiUrl2 + `${this.state.selectedTimezone}`)
        // console.log(this.state.selectedTimezone)
        .then((response) => {
          // console.log(response.data);
          var dt = response.data.datetime;
          let dts = dt.split('T');
          // console.log(dts);
          var date = document.getElementById('date');
          date.value = dts[0];
          var ts = dts[1];
          // console.log(ts);
          var timec = document.getElementById('c-time');
          timec.value = ts.slice(0, 8);
          var off = document.getElementById('utc-offset')
          off.value = ts.slice(15);
        })
        .catch(error => console.log('error', error));
    });

  }

  render() {
    const { timezones, dataFetched, selectedTimezone, currentTimeInTimezone } = this.state;
    const another = timezones.map((timezone => {
      return {
        key: timezone,
        text: timezone,
        value: timezone
      }
    }));
    // console.log(selectedTimezone);
    if (dataFetched) {
      return (
        <div>
            <Segment size='large' textAlign='left' fluid id='myHeader'>
              <Header as='h1'>TimeZones</Header>
            </Segment>
          <Container verticalAlign='middle' id='dataFetchedBox'>
            <Grid.Column></Grid.Column>
            <Grid.Column>
              <Segment padded id='onemore'>

                <Segment>
                  <Grid>
                    <Grid.Column as={Form} success>
                    <Message 
                      success
                      header='Data Fetched!' 
                      content='Now, select your Time Zone.'
                      />
                      <Form.Field>
                        <Form.Select
                          options={another}
                          label='Select your Time Zone'
                          fluid
                          placeholder='Select your timezone'
                          onChange={this.updateSelectedTimeZone}
                        />
                        {/* <Form.Button> Done </Form.Button> */}
                      </Form.Field>
                      <Form.Group readOnly>
                        <Form.Input id='selectedTimezone' label='Selected Time Zone' width={5}>

                        </Form.Input>
                        <Form.Input id='date' label='Current Date' width={5} readOnly>

                        </Form.Input>
                        <Form.Input id='c-time' label='Current Time' width={5} readOnly>

                        </Form.Input>
                        <Form.Input id='utc-offset' label='UTC Offset' width={5} readOnly>

                        </Form.Input>
                      </Form.Group>
                    </Grid.Column>
                  </Grid>
                </Segment>
              </Segment>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Container>
        </div>
      );
    }
    else {
      return (
        <div id='loadingTime'>
            <Segment size='large' textAlign='left' id='myHeader' fluid>
              <Header as='h1'>TimeZones</Header>
            </Segment>
          <Container id='loader-box'>
            <Grid.Column>  
              <Message icon>
                <Icon name='circle notched' loading />
                <Message.Content>
                  <Message.Header>Just one second</Message.Header>
                We are fetching that content for you.
              </Message.Content>
              </Message>
            </Grid.Column>
          </Container>
        </div>
      );
    }
  }
}

export default App;