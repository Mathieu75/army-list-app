import React, { Component } from 'react';
import BtnClose from '../generic/BtnClose';
import MyMenu from '../generic/MyMenu';
import SquadList from './SquadList';
import ArmyAppUtils from './Utils/ArmyAppUtils';


export default class SchemeDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSchemeForm: false,
      showSquadForm: false,
      menu: [],
      points: 0,
      squadList: [],
      scheme: this.props.scheme
    };

    this.closeSquadList = this.closeSquadList.bind(this);
    this.showSquadList = this.showSquadList.bind(this);
    this.updatePoints = this.updatePoints.bind(this);
  }

  componentWillMount() {
    this.updatePoints(this.state.scheme);
  }
  

  updatePoints(scheme) {
    ArmyAppUtils.calcSchemePoints(scheme).then((newPoints) => {
      this.setState({ points: newPoints });
    });
  }

  showSquadList(scheme) {
    var sds = [];
    this.props.hideArmies(this.state.army);
    sds.push(<SquadList 
      scheme={scheme} 
      army={this.state.army} 
      close={this.closeSquadList} 
      updatePoints={this.updatePoints} 
      key={"squadList" + scheme.schemeId} 
      updateSchemes={this.updateSchemes}
    />);
    this.setState({ squadList: sds });
  }

  closeSquadList() {
    this.props.showArmies();
    this.setState({ squadList: [] });
  }


  render() {
     return (
      <div className="scheme" key={"scheme" + this.state.scheme.schemeId}>
        <div className="scheme-element">
          <div className="scheme-element-name" onClick={this.showSquadList.bind(this, this.state.scheme)}>
            {this.state.scheme.name}
          </div>
          <div className="scheme-element-pts">
            {this.state.points} pts
          </div>
        </div>
        <div>
          {this.state.squadList}
        </div>
      </div>
    );
  }

}