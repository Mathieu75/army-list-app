import React, { Component } from 'react';
import ConfigUtils from '../Utils/ConfigUtils';
import Header from '../Header';
import troupe_n from '../../images/troupe_n.png';
import elite_n from '../../images/elite_n.png';
import qg_n from '../../images/qg_n.png';
import soutien_n from '../../images/soutien_n.png';
import rapide_n from '../../images/rapide_n.png';
import arrow_n from '../../images/arrow_n.png';

export default class Config extends Component {
  constructor() {
    super();
    this.state = { 
      config: [],
      squads: [],
      logos: {
        "t":troupe_n,
        "e":elite_n,
        "q":qg_n,
        "s":soutien_n,
        "r":rapide_n 
      }
    };

    this.changeOrder = this.changeOrder.bind(this);

  }

  componentWillMount() {
    ConfigUtils.getConfig().then((config) => {
      let squads = [
        { key: "t", value: config.squads["t"] },
        { key: "e", value: config.squads["e"] },
        { key: "q", value: config.squads["q"] },
        { key: "s", value: config.squads["s"] },
        { key: "r", value: config.squads["r"] }
      ];

      squads.sort((a, b) => {
        return a.value - b.value;
      });
      this.setState({ config: config, squads: squads });
    });
  }

  changeOrder(squad, scale) {
    const config = this.state.config;
    const squads = this.state.squads;
    const newValue = squad.value + scale;
    const oldValue = squad.value;
    if(squad.value !== 5){
      for(let s of squads){
        if(s.value  === newValue ){
          s.value = oldValue;
        }
        if(s.key === squad.key){
          s.value = newValue;
        }
        config.squads[s.key] = s.value;
      }

      ConfigUtils.saveObject("config",config);
      squads.sort((a, b) => {
        return a.value - b.value;
      });
      this.setState({ squads: squads });
    }

  }

  render() {
    return (
      <div className="Config">
        <Header title="Paramètres" />

        <div className="line-header">
            ordre d'affichage 
        </div>
        <div className="squads-config">
          {this.state.squads.map((squad) => {
            return (
              <div className="squad-config" key={"squadConfig" + squad.value}>
                <div className="squad-logo">
                  <img src={this.state.logos[squad.key]} className="add-logo" alt="logo" />
                </div>
                <div className="controls">
                  <div  onClick={this.changeOrder.bind(this, squad, -1)}>
                    <img src={arrow_n} className="arrow up" alt="logo" />
                  </div>
                  <div onClick={this.changeOrder.bind(this, squad, 1)}>
                    <img src={arrow_n} className="arrow down" alt="logo" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="line-header">
            <a  target="_blank" href="https://army-list-app.firebaseapp.com">go to webiste</a>
        </div>

      </div>
    );
  }
}


