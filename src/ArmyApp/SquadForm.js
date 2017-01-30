import React, { Component } from 'react';
import BtnAdd from '../generic/BtnAdd';
import { Squad } from "./models/index";

export default class SquadForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            show: false,
            showSchemeForm: false,
            scheme: this.props.scheme,
            squad: this.props.squad ? this.props.squad: new Squad(this.props.scheme.schemeId),
            points: 0
        };
        this.updateSquad = this.updateSquad.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    updateSquad(arg, event) {
        const squad = this.state.squad;
        squad[arg] = event.target.value;
        this.setState({ squad: squad });
    }


    clearForm() {
        if(this.props.type !== "update"){
            this.setState({ squad: new Squad(this.props.scheme.schemeId) });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.squad.name) {
            this.props.addSquad(this.state.squad);
            this.clearForm();
        }
    }
    render() {
        return (
            <div className="Squad-form-content">
                <form className="Squad-form-form" onSubmit={this.handleSubmit} >
                    <input className="Squad-form-line" type="text" placeholder="Nom" value={this.state.squad.name} onChange={this.updateSquad.bind(this, "name")} />
                    <select name="select" value={this.state.squad.type} onChange={this.updateSquad.bind(this, "type")}>
                        <option value="q">QG</option> 
                        <option value="e">Elite</option>
                        <option value="t">Troupe</option>
                        <option value="r">Attaque Rapide</option>
                        <option value="s">Soutien</option>
                    </select>
                    <input className="Squad-form-line" type="text" placeholder="Points" value={this.state.squad.points} onChange={this.updateSquad.bind(this, "points")} />
                    <textarea rows="8" placeholder="description" value={this.state.squad.details} onChange={this.updateSquad.bind(this, "details")}></textarea>
                    <button className="add" type="submit">
                        <BtnAdd logo="w" />
                    </button>
                </form>
            </div>
        );

    }


}
