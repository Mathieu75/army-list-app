import React, { Component } from 'react';
import SchemeForm from './SchemeForm';
import ArmyAppUtils from './Utils/ArmyAppUtils';
import BtnAdd from '../generic/BtnAdd';
import MyMenu from '../generic/MyMenu';
import SchemeList from './SchemeList'

export default class ArmyDetails extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            schemaCount: "",
            schemeList: [],
            menu: [],
            showSchemeForm: false,
            showArmyForm:false,
            army: this.props.army
        };
        this.toggleshowSchemeForm = this.toggleshowSchemeForm.bind(this);
        this.toggleshowArmyForm = this.toggleshowArmyForm.bind(this);
        this.addScheme = this.addScheme.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.renderSchemeForm = this.renderSchemeForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addMenu = this.addMenu.bind(this);
        this.updateSchemaList = this.updateSchemaList.bind(this);
        this.toogleSchemaList = this.toogleSchemaList.bind(this);
        this.updateSchemes = this.updateSchemes.bind(this);
    }
    componentWillMount(){
        let m = []
        m.push(this.addMenu());
        this.setState({
            menu:m
        });
        ArmyAppUtils.getSchemes(this.state.army).then((results) => {
            if (results.schemes === null || results.schemes.length === 0) {
                results.schemes = [];
            }
            if(results.schemes.length > 0){
                this.setState({
                    schemaCount: "(" + results.schemes.length + ")",
                });
            }
        });
    }
    updateSchemaList(){
        let m = []
        m.push(this.addMenu());
        let sl = [];
        sl.push(<SchemeList
            key={"SchemeList" + this.state.army.armyId}
            army={this.state.army}
            showArmies={this.props.showArmies}
            hideArmies={this.props.hideArmies}
            updateSchemes={this.updateSchemaList}
            onUserInput={this.handleUserInput}
            addScheme={this.addScheme} />);
        this.setState({
            schemeList: sl,
            menu:m
        });
        ArmyAppUtils.getSchemes(this.state.army).then((results) => {
            if (results.schemes === null || results.schemes.length === 0) {
                results.schemes = [];
            }
            if(results.schemes.length > 0){
                this.setState({
                    schemaCount: "(" + results.schemes.length + ")",
                });
            }
        });
    }
    toogleSchemaList(){
        if(this.state.schemeList.length>0){
            this.setState({
                schemeList: []
            });
        }else{
            this.updateSchemaList();
        }
    }
    toggleshowSchemeForm() {
        this.setState(prevState => ({
            showSchemeForm: !prevState.showSchemeForm
        }));
    }

    toggleshowArmyForm() {
        this.setState(prevState => ({
            showArmyForm: !prevState.showArmyForm
        }));
    }
    handleUserInput(army) {
        this.setState({
            army: army
        });
    }
    addScheme(scheme) {
        this.setState({
            schemeList: [],
            menu:[]
        });
        ArmyAppUtils.addScheme(scheme).then((scheme) => {
            this.updateSchemaList()
        });
    }

    updateSchemes(schemes){
        this.setState({
            schemeList: schemes
        });
        this.updateSchemaList();
    }

    renderSchemeForm() {
        if (this.state.showSchemeForm) {
            return (<SchemeForm
                addScheme={this.addScheme}
                army={this.state.army}
                toggleshowSchemeForm={this.toggleshowSchemeForm}
                onUserInput={this.handleUserInput} />);
        } else {
            return null;
        }
    }

    updateArmy(arg,event){
        const army = this.state.army;
        army[arg] = event.target.value;
        this.setState({ army: army });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.army.name) {
            let m = []
            this.setState({menu:[]});
            ArmyAppUtils.updateArmy(this.state.army).then(() => {
                m.push(this.addMenu());
                this.toggleshowArmyForm();
                this.setState({menu:m});
            });
        }
    }
    addMenu(){
        return <MyMenu 
            key={"MyMenu" + this.state.army.armyId} 
            add={this.toggleshowSchemeForm} 
            close={this.toggleshowSchemeForm} 
            edit={this.toggleshowArmyForm} 
            delete={this.props.deleteArmy} 
            />;
    }
    renderArmyForm() {
        if (this.state.showArmyForm) {
            return (
                <div className="Army-form-header" >
                    <form className="inline" onSubmit={this.handleSubmit}>
                        <input 
                            className="form-name" 
                            type="text" 
                            placeholder="Nom" 
                            value={this.state.army.name}
                            onChange={this.updateArmy.bind(this,"name")} 
                        />
                        <button className="addinline" type="submit">
                            <BtnAdd logo="w" />
                        </button>
                    </form>
                </div>
            );
        } else {
            return (
                <div className="Army-header" onClick={this.toogleSchemaList}>
                    {this.state.army.name} {this.state.schemaCount}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="ArmyDetails">
                <div className="Army-form">
                    {this.renderArmyForm()}
                    
                    {this.state.menu}
                    
                </div>
                {this.renderSchemeForm()}

                {this.state.schemeList}

            </div>
        );
    }
}
