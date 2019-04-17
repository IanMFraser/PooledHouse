import React, { Component } from 'react';
import './App.css';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import TipInfo from './TipInfo/TipInfo';
import Map from './Components/Map/map';  
// react-bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Container from 'react-bootstrap/Container'

//for maps
import styled from 'styled-components';

// View Component
import ViewTipInfo from './Components/ViewTipInfo/ViewTipInfo';
import './Components/ViewTipInfo/ViewTipInfo.css';
//amplify imports
import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import { Connect } from 'aws-amplify-react';

import aws_config from './aws-exports';

import * as queries from './graphql/queries'

Amplify.configure(awsmobile);
Amplify.configure(aws_config);

// component to get data from user / guest

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showHome: true,
      showSignUp: false,
      showTipUpdate: false,
      curr_user_username: '',
    }

    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleTipUpdate = this.handleTipUpdate.bind(this);
  }

  handleSignUp = () => {
    this.setState({
      showHome: !this.state.showHome,
      showSignUp: !this.state.showSignUp
    });
  }

  handleTipUpdate = () => {
    this.setState({
      showHome: !this.state.showHome,
      showTipUpdate: !this.state.showTipUpdate
    })
  }

  //this grabs email attribute from current user.  testing for 
  //collecting current user attributes.
  //componentDidMount is executed after the webpage is rendered,
  //allowing for the page to be reloaded with data from API calls?

  async componentDidMount() {
    let current_user = await Auth.currentAuthenticatedUser();
    let un = current_user.username;
    this.setState({
      curr_user_username: un
    })
  }

  render() {

    // this ListView handles information from the connect component and organizes
    // them in a meaningful way on the the webpage.

    const ListView = ({ tip_entries }) => (
      <div>
        <h3>All Entries</h3>
        <ul>
            {tip_entries.map(entry => 
              <li key={entry.id}>business: {entry.business_name}, 
                                 takehome: {entry.takehome}, 
                                 date: {entry.shift_date}
              </li>
            )
            }
        </ul>
      </div>
    );

    const home = (
      <Navbar className="bg-olive justify-content-between">

        {/* TODO: update the logo with Navbar.Brand */}
        <h3 className="text-color-white">Pooled House</h3>

        <Form inline>
          <FormControl type="text" placeholder="ex: upper manhattan" className="mr-sm" />
          <Button type="submit" variant="outline-light"><span>{"\uD83D\uDD0D"}</span></Button>
        </Form>

        <ButtonToolbar>
          <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
            <ToggleButton value={1} variant="warning">Map View</ToggleButton>
            <ToggleButton value={2} variant="warning">List View</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        
        <ButtonToolbar>
          <Button 
            href="#" variant="link" className="text-color-white" 
            onClick={this.handleTipUpdate}>Tip Update
          </Button>
        </ButtonToolbar>
      </Navbar>

      );

      // this prints the current entries in our db in the web console
      const allEntries = API.graphql(graphqlOperation(queries.listTipEntrys));
      console.log(allEntries);

      const ShowUsernameMessage = () => (
        <div>
          <p>
            Current user is {this.state.curr_user_username}
          </p>
        </div>
      )

    return (
      <div className="App">
        {this.state.showSignUp ? <SignUp handler={this.handleSignUp} /> : <div id="home">{home} <Map/></div>}
        {this.state.showTipUpdate ? <TipInfo handler={this.handleTipUpdate}/> : null }
        {/* the connect component queries our database and then passes the query
          result to the ListView function */} 
        <Connect query={graphqlOperation(queries.listTipEntrys)}>
        {({ data: { listTipEntrys }, loading, error }) => {
            if (error) return (<h3>Error</h3>);
            if (loading || !listTipEntrys) return (<h3>Loading...</h3>);
            // return (<ListView tip_entries={listTipEntrys.items} /> );
            return (<ViewTipInfo tipInfo={listTipEntrys.items} /> );
        }}
        </Connect>
        <ShowUsernameMessage />
      </div>
    );
  }
}

export default withAuthenticator(App, true);