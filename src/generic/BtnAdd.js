import React, { Component } from 'react';
import logo_w from '../images/plus_w.png';
import logo_o from '../images/plus_o.png';
import logo_n from '../images/plus_n.png';

export default class BtnAdd extends Component {
  constructor(props) {
    super(props);
    this.state = { 'w': logo_w, 'o': logo_o,'n': logo_n}; 
  }
  render() {
    return (<img src={this.state[this.props.logo]} className={this.props.logoClassName ? this.props.logoClassName :"add-logo"} alt="logo" />  );
  }
}
