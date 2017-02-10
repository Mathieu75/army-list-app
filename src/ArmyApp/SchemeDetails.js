import React, { Component } from 'react';
import MyMenu from '../generic/MyMenu';
import SquadList from './SquadList';
import SchemeForm from './SchemeForm';
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

    this.toggleshowSchemeForm = this.toggleshowSchemeForm.bind(this);
    this.showSquadList = this.showSquadList.bind(this);
    this.addMenu = this.addMenu.bind(this);
    this.updatePoints = this.updatePoints.bind(this);
    this.deleteScheme = this.deleteScheme.bind(this);
    this.updateScheme = this.updateScheme.bind(this);
    this.duplicate = this.duplicate.bind(this);
  }

  componentWillMount() {
    this.updatePoints(this.state.scheme);
    let m = []
    m.push(this.addMenu());
    this.setState({
      menu: m
    });
  }

  addMenu() {
    return <MyMenu
      defaultLogo="n"
      key={"SchemeForm" + this.state.scheme.schemeId}
      edit={this.toggleshowSchemeForm}
      delete={this.deleteScheme}
      duplicate={this.duplicate}
      />;
  }

  duplicate() {
    ArmyAppUtils.duplicateScheme(this.state.scheme).then((schemes) => {
      this.props.updateSchemes(schemes);
    });
  }

  deleteScheme() {
    ArmyAppUtils.deleteScheme(this.state.scheme).then((schemes) => {
      this.props.updateSchemes(schemes);
    });
  }


  updatePoints(scheme) {
    ArmyAppUtils.calcSchemePoints(scheme).then((newPoints) => {
      this.setState({ points: newPoints });
    });
  }

  showSquadList(scheme) {
    let item = {content : <SquadList
        scheme={scheme}
        army={this.state.army}
        close={this.props.showArmies}
        updatePoints={this.updatePoints}
        key={"squadList" + scheme.schemeId}
        updateSchemes={this.updateSchemes}
      />
    };
    this.props.hideArmies(item);
  }

  toggleshowSchemeForm() {
    this.setState(prevState => ({
      showSchemeForm: !prevState.showSchemeForm
    }));
  }

  updateScheme(scheme) {
    event.preventDefault();
    if (scheme.name) {
      let m = []
      this.setState({ menu: [] });
      ArmyAppUtils.updateScheme(scheme).then(() => {
        m.push(this.addMenu());
        this.setState({
          menu: m,
          scheme: scheme
        });
      });
    }
  }

  renderschemeForm() {
    if (this.state.showSchemeForm) {
      return (
        <div className="Scheme-header" >
          <SchemeForm
            addScheme={this.updateScheme}
            toggleshowSchemeForm={this.toggleshowSchemeForm}
            type="update"
            formClass="inline"
            scheme={this.state.scheme}
            onUserInput={this.handleUserInput}
            />
        </div>
      );
    } else {
      return (
        <div className="scheme-line" onClick={this.showSquadList.bind(this, this.state.scheme)}>
          <div className="Squad-form-scheme-name">
            {this.state.scheme.name}
          </div>
          <div className="Squad-form-scheme-pts">
            {this.state.points} pts
           </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="scheme" key={"scheme" + this.state.scheme.schemeId}>
        {this.renderschemeForm()}
        {this.state.menu}
      </div>
    );
  }

}