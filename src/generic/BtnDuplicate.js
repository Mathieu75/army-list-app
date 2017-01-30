import React, { Component } from 'react';
import logo_w from '../images/duplicate_w.png';
import logo_n from '../images/duplicate_n.png';

export default class BtnDuplicate extends Component {
  constructor(props) {
    super(props);
    this.state = { 'w': logo_w, 'n': logo_n}; 
  }
  render() {
    return (<img src={this.state[this.props.logo]} className={this.props.logoClassName ? this.props.logoClassName :"add-logo"} alt="logo" />  );
  }
}