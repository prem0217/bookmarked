import React, { Component } from 'react'
import { auth } from '../helpers/auth'

export default class Register extends Component {

  handleSubmit = (e) => {
    e.preventDefault()

    auth(this.email.value, this.pw.value, this.username.value)
  }

  render () {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1>Register</h1>

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email"/>
            <p id="emailErrorMsg"></p>

            <label>Username</label>
            <input className="form-control" ref={(username) => this.username = username} placeholder="Username"/>

          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
            <p id="pwErrorMsg"></p>
          </div>
          <button type="submit" className="btn btn-primary">Register</button>

        </form>
      </div>
    )
  }
}
