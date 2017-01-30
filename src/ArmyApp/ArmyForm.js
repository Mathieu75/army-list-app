import React, { Component } from 'react';
import BtnAdd from '../generic/BtnAdd';
import  { Army } from "./models/index"

export default class ArmyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  army: new Army() };
        this.updateArmy = this.updateArmy.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearArmy = this.clearArmy.bind(this);
    }
    updateArmy(arg,event) {
        const army = this.state.army;
        army[arg] = event.target.value;
        this.setState({ army: army });
    }
    clearArmy() {
        this.setState({ army: new Army() });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.army.name) {
            this.props.addArmy(this.state.army);
            this.props.toggleshowArmyForm();
            this.clearArmy();
        }
    }

    render() {
        return (
            <div className="Army-form-content">
                <form onSubmit={this.handleSubmit}>
                    <input 
                        className="Army-form-army-name" 
                        type="text" 
                        placeholder="Nom de l'armée" 
                        value={this.state.army.name}
                        onChange={this.updateArmy.bind(this,"name")} 
                    />
                    <button className="add" type="submit">
                        <BtnAdd logo="w" />
                    </button>
                </form>
            </div>
        );
    }
}
