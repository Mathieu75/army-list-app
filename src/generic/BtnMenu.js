import React, { Component } from 'react';
import logo_w from '../images/options_w.png';
import logo_o from '../images/options_o.png';
import logo_n from '../images/options_n.png';

export default class BtnMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { 'w': logo_w, 'o': logo_o, 'n': logo_n}; 
  }
  render() {
    return (<img src={this.state[this.props.logo]} className={this.props.logoClassName ? this.props.logoClassName :"add-logo"} alt="logo" />  );
  }
}