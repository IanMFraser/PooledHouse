import React, { Component } from 'react';
import './SignUp.css';

class SighUp extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  submit(e) {
    alert('Account for ' + this.input.value + " is created");
    e.preventDefault();
  }

  render() {
    return (<div>
      <form className='container' onSubmit={this.submit}>
        <label>First Name:
          <input type='text' name='FirstName' placeholder='First Name' required/>
        </label>
        <label>Last Name: 
          <input type='text' name='LastName' placeholder='Last Name' required/>
        </label>
        <label>Phone Number: 
          <input type='tel' name='Telephone' placeholder='Phone Number' required/>
        </label>
        <label>Username:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <label>Password: 
          <input type='password' name='Password' placeholder='Password' required/>
        </label>
        <label>Confirm Password: 
          <input type='password' name='ConfirmPassword' placeholder='Confirm Password' required/>
        </label>
        <input type="submit" value="Submit" className='button'/>
      </form>
    </div>);
  }
}

export default SighUp;
