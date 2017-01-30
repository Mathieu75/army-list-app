import React, { Component } from 'react';
import logo_w from '../images/edit_w.png';
import logo_o from '../images/edit_o.png';
import logo_n from '../images/edit_n.png';

export default class BtnEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { 'w': logo_w, 'o': logo_o, 'n': logo_n}; 
  }
  render() {
    return (<img src={this.state[this.props.logo]} className={this.props.logoClassName ? this.props.logoClassName :"add-logo"} alt="logo" />  );
  }
}