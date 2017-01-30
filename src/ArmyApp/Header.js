import React, { Component } from 'react';
import logo from '../images/logo.png';

export default class Header extends Component {
  constructor(props){
    super(props)
    this.state ={title : this.props.title?this.props.title:""};
  }
  render() {
    return (
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="header-title" >{this.state.title}</div>
        </div>
    );
  }
}
