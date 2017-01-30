import React, { Component } from 'react';
import MyMenu from '../generic/MyMenu';
import SquadForm from './SquadForm';
import ArmyAppUtils from './Utils/ArmyAppUtils';
import troupe_n from '../images/troupe_n.png';
import elite_n from '../images/elite_n.png';
import qg_n from '../images/qg_n.png';
import soutien_n from '../images/soutien_n.png';
import rapide_n from '../images/rapide_n.png';

export default class SquadDetail extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      showdDetails: false, 
      showSquadForm: false,
      squad: this.props.squad,
      menu: [],
      logos: {
        "t":troupe_n,
        "e":elite_n,
        "q":qg_n,
        "s":soutien_n,
        "r":rapide_n 
      }
    };
    this.showdDetails = this.showdDetails.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.addMenu = this.addMenu.bind(this);
    this.toggleShowSquadForm = this.toggleShowSquadForm.bind(this);
    this.renderSquadForm = this.renderSquadForm.bind(this);
    this.updateSquad = this.updateSquad.bind(this);
    this.deleteSquad = this.deleteSquad.bind(this);
    this.duplicate = this.duplicate.bind(this);
  }
  componentWillMount() {
    let m = []
    m.push(this.addMenu());
    this.setState({
      menu: m
    });
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showdDetails: !prevState.showdDetails
    }));
  }


  toggleShowSquadForm() {
    this.setState(prevState => ({
      showSquadForm: !prevState.showSquadForm
    }));
  }

  updateSquad(){
    let m = [];
    this.setState({
      menu: m
    });
    ArmyAppUtils.updateSquad(this.state.squad).then(()=>{
      this.props.updateSquads();
      this.toggleShowSquadForm();
      m.push(this.addMenu());
      this.setState({
        menu: m
      });
    });
  }

  deleteSquad(){
    let m = [];
    this.setState({
      menu: m
    });
    ArmyAppUtils.deleteSquad(this.state.squad).then((squads)=>{
      this.props.updateSquads();
      
      m.push(this.addMenu());
      this.setState({
        menu: m
      });
    });
  }

  duplicate(){
    this.props.duplicateSquad(this.state.squad, true);
  }
    
  addMenu(){
      return <MyMenu  
          defaultLogo="n"
          key={"squadMenu" + this.state.squad.squadId }
          edit={this.toggleShowSquadForm}
          delete={this.deleteSquad}
          duplicate={this.duplicate}
      />;
  }
  showdDetails() {
    if (this.state.showdDetails) {
      return (
        <div className="squad-details" >
          {this.state.squad.details}
        </div>
      );
    } else {
      return null;
    }
  }
  renderSquadForm() {
    if (this.state.showSquadForm) {
      return (
        <div className="squad-form">
        <SquadForm
          squad={this.state.squad}
          addSquad={this.updateSquad}
          type="update"
          scheme={this.state.scheme}
          onUserInput={this.handleUserInput} />
      </div>
      );
    } else {
      return null;
    }
  }


  render() {
    return (
      <div className="squad">
      <div className="squad-line">
        <div className="squad-logo">
          <img src={this.state.logos[this.state.squad.type]} className="add-logo" alt="logo" />
        </div>
        <div className="squad-name" onClick={this.handleToggleClick}>
          
          <div>
            {this.state.squad.name}
          </div>
          <div >
            {this.state.squad.points} pts
          </div>
        </div>
        {this.state.menu}
      </div>
        {this.showdDetails()}
        {this.renderSquadForm()}
      </div>
    );
  }

}