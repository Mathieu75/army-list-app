import React, { Component } from 'react';
import SchemeDetails from './SchemeDetails';
import ArmyAppUtils from './Utils/ArmyAppUtils';

export default class SchemeList extends Component {
  constructor(props) {
    super(props);
    this.state = {  army: this.props.army, schemes: [], points: [] };
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

  render() {
    return (

      <div className="schemes" >
        {this.state.schemes.map((scheme) => {
          return (
            <SchemeDetails 
              scheme={scheme} 
              army={this.state.army} 
              hideArmies={this.props.hideArmies}
              showArmies={this.props.showArmies}
              key={"SchemeDetails" + scheme.schemeId} 
            />
          );
        })}
      </div>
    );
  }
}
