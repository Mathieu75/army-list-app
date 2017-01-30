import React, { Component } from 'react';
import SquadForm from './SquadForm';
import Header from './Header';
import Footer from './Footer';
import BtnClose from '../generic/BtnClose';
import SquadDetail from './SquadDetail';
import SchemeForm from './SchemeForm';
import MyMenu from '../generic/MyMenu';
import ArmyAppUtils from './Utils/ArmyAppUtils';

export default class SchemeDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showSchemeForm: false,
      showSquadForm: false,
      menu: [],
      points: 0,
      schemeDetails: [],
      scheme: this.props.scheme,
      squads: []
    };
    this.addSquad = this.addSquad.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.addMenu = this.addMenu.bind(this);

    this.renderschemeForm = this.renderschemeForm.bind(this);
    this.toggleshowSchemeForm = this.toggleshowSchemeForm.bind(this);
    this.updateScheme = this.updateScheme.bind(this);
    this.deleteScheme = this.deleteScheme.bind(this);

    this.toggleshowSquadForm = this.toggleshowSquadForm.bind(this);
    this.updateSquads = this.updateSquads.bind(this);
  }



  componentWillMount() {
    this.updateSquads();
  }

  addSquad(squad, fromDuplicate) {
    let that = this;
    const squads = this.state.squads;
    let m = []
    this.setState({ menu: m });
    ArmyAppUtils.addSquad(squad).then((squadResult) => {
      m.push(that.addMenu());
      that.setState({ menu: m });
      if(!fromDuplicate){
        that.toggleshowSquadForm();
      }
      squads.push(squadResult);
      let points = parseInt(this.state.points, 10) + parseInt(squadResult.points, 10);
      this.setState({ points: points });
      that.setState({
        squads: squads,
        points: points
      });
      that.props.updatePoints(that.state.scheme);
    });
  }

  updateSquads() {
    let m = []
    m.push(this.addMenu());
      this.setState({
        squads: []
      });
    ArmyAppUtils.getSquads(this.state.scheme).then((squads) => {
      if (squads === null || squads.length === 0) {
        squads = [];
      }
      this.setState({
        menu: m,
        squads: squads
      });
    });
    ArmyAppUtils.calcSchemePoints(this.state.scheme).then((points) => {
      this.setState({
        points: points
      });
      this.props.updatePoints(this.state.scheme);
    });
  }

  handleUserInput(scheme) {
    this.setState({
      scheme: scheme
    });
  }

  addMenu() {
    return <MyMenu key={"schemeMenu" + this.state.scheme.schemeId}
      add={this.toggleshowSquadForm}
      close={this.toggleshowSquadForm}
      edit={this.toggleshowSchemeForm}
      delete={this.deleteScheme}
      />;
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
  deleteScheme(){
    ArmyAppUtils.deleteScheme(this.state.scheme).then((schemes)=>{
      this.props.updateSchemes(schemes);
    });
  }


  renderSquadForm() {
    if (this.state.show) {
      return (
        <SquadForm
          addSquad={this.addSquad}
          scheme={this.state.scheme}
          onUserInput={this.handleUserInput} />
      );
    } else {
      return null;
    }
  }

  toggleshowSquadForm() {
    this.setState(prevState => ({
      show: !prevState.show
    }));
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
        <div className="Squad-form-scheme">
          <div className="Squad-form-scheme-name" onClick={this.showDetails}>
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
      <div className="SchemeDetails">
        <Header title="Schémas" />
        <div onClick={this.props.close}>
          <BtnClose logo='w' logoClassName="header-buton" />
        </div>
        <div className="Squad-form">
          <div className="Squad-form-header">

            {this.renderschemeForm()}

            {this.state.menu}


          </div>
          {this.renderSquadForm()}
        </div>

        <div className="squads">
          {this.state.squads.map((squad, i) => {
            return (
              <SquadDetail
                key={"squad" + i}
                squad={squad}
                updateSquads={this.updateSquads}
                duplicateSquad={this.addSquad}
                />
            );
          })}
        </div>
        <Footer showButtons={false}/>
      </div>
    );
  }

}