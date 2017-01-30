import React, { Component } from 'react';
import SchemeDetails from './SchemeDetails';
import ArmyAppUtils from './Utils/ArmyAppUtils';

export default class SchemeList extends Component {
  constructor(props) {
    super(props);
    this.state = { schemeDetails: [], army: this.props.army, schemes: [], points: [] };
    this.showDetails = this.showDetails.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
    this.updatePoints = this.updatePoints.bind(this);
    this.updateSchemes = this.updateSchemes.bind(this);
  }
  componentWillMount() {
    ArmyAppUtils.getSchemes(this.state.army).then((results) => {
      if (results.schemes === null || results.schemes.length === 0) {
        results.schemes = [];
      }
      this.setState({
        schemes: results.schemes,
        points: results.points
      });
    });
  }

  showDetails(scheme) {
    var sds = [];
    this.props.hideArmies(this.state.army);
    sds.push(<SchemeDetails 
      scheme={scheme} 
      army={this.state.army} 
      close={this.closeDetails} 
      updatePoints={this.updatePoints} 
      key={"SchemeDetails" + scheme.schemeId} 
      updateSchemes={this.updateSchemes}
    />);
    this.setState({ schemeDetails: sds });
  }

  updatePoints(scheme) {
    const points = this.state.points;
    ArmyAppUtils.calcSchemePoints(scheme).then((newPoints) => {
      points[scheme.schemeId] = newPoints;
      this.setState({ points: points });
    });
  }

  updateSchemes(schemes) {
   ArmyAppUtils.getSchemes(this.state.army).then((results) => {
      if (results.schemes === null || results.schemes.length === 0) {
        results.schemes = [];
      }
      this.setState({
        schemes: results.schemes,
        points: results.points
      });
    });
  }

  closeDetails() {
    this.props.showArmies();
    this.setState({ schemeDetails: [] });
  }

  render() {
    return (

      <div className="schemes" >
        {this.state.schemes.map((scheme) => {
          return (
            <div className="scheme" key={"scheme" + scheme.schemeId}>
              <div className="scheme-element">
                <div className="scheme-element-name" onClick={this.showDetails.bind(this, scheme)}>
                  {scheme.name}
                </div>
                <div className="scheme-element-pts">
                  {this.state.points[scheme.schemeId]} pts
                </div>
              </div>
              <div>
                {this.state.schemeDetails}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
