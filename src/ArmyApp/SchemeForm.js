import React, { Component } from 'react';
import BtnAdd from '../generic/BtnAdd';
import { Scheme } from "./models/index"

export default class SchemeForm extends Component {
    constructor(props) {
        super(props);

        this.state = {  
            formClass : this.props.formClass ? this.props.formClass : "",
            scheme : this.props.scheme ? this.props.scheme : new Scheme(this.props.army.armyId) 
        };
        this.updateScheme = this.updateScheme.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearScheme = this.clearScheme.bind(this);
    }
    updateScheme(arg,event) {
        const scheme = this.state.scheme;
        scheme[arg] = event.target.value;
        this.setState({ scheme: scheme });
    }
    clearScheme() {
        if(this.props.type !== "update"){
            this.setState({ scheme: new Scheme(this.props.army.armyId) });
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.scheme.name) {
            this.props.addScheme(this.state.scheme);
            this.props.toggleshowSchemeForm();
            this.clearScheme();
        }
    }

    render() {
        return (
            <div className="Scheme-form-content">
                <form className={this.state.formClass} onSubmit={this.handleSubmit}>
                    <input 
                        className="Scheme-form-army-name" 
                        type="text" 
                        placeholder="Nom de la liste d'armée" 
                        value={this.state.scheme.name}
                        onChange={this.updateScheme.bind(this,"name")} 
                    />
                    <button className={"add" + this.state.formClass} type="submit">
                        <BtnAdd logo="w" />
                    </button>
                </form>
            </div>
        );
    }
}
