import React, { Component } from 'react';
import ArmyAppUtils from './Utils/ArmyAppUtils';
import BtnAdd from '../generic/BtnAdd';
import ArmyDetails from './ArmyDetails';
import Footer from './Footer';
import Header from './Header';
import ArmyForm from './ArmyForm';

export default class ArmyApp extends Component {
    constructor() {
        super();
        this.state = { logoHeader: "w", showArmyForm: false, armies: [] };

        this.addArmy = this.addArmy.bind(this);
        this.toggleshowArmyForm = this.toggleshowArmyForm.bind(this);
        this.renderArmyForm = this.renderArmyForm.bind(this);
        this.deleteArmy = this.deleteArmy.bind(this);
        this.updateArmies = this.updateArmies.bind(this);
        this.hideArmies = this.hideArmies.bind(this);
    }

    componentWillMount() {
        this.updateArmies();
    }

    addArmy(army) {
        const al = this.state.armies;
        let that = this;
        ArmyAppUtils.addArmy(army).then(() => {
            al.push(army);
            that.setState({
                armies: al
            });
        });
    }

    deleteArmy(army) {
        let that = this;
        ArmyAppUtils.deleteArmy(army).then((armies) => {
            that.setState({
                armies: armies
            });
        });
    }

    toggleshowArmyForm() {
        this.setState(prevState => ({
            showArmyForm: !prevState.showArmyForm,
            logoHeader: !prevState.showArmyForm ? "o" : "w"
        }));
    }
    renderArmyForm() {
        if (this.state.showArmyForm) {
            return (<ArmyForm
                addArmy={this.addArmy}
                toggleshowArmyForm={this.toggleshowArmyForm} />);
        } else {
            return null;
        }
    }


    handleUserInput(army) {
        this.setState({
            army: army
        });
    }

    updateArmies(){
        ArmyAppUtils.getDataFromDB("armies").then((armiesFromDb) => {
            if (armiesFromDb == null || armiesFromDb.length === 0) {
                armiesFromDb = [];
                ArmyAppUtils.initWebSQL();
            }
            this.setState({
                armies: armiesFromDb
            });
        });
    }
    hideArmies(item){
        this.props.switchContent(item);
    }

    render() {
        return (
            <div className="Armies">
                <Header title="Armées" />
                <div className="Army-list">
                    {this.renderArmyForm()}
                    <div className="add button" onClick={this.toggleshowArmyForm}>
                        <BtnAdd logo={this.state.logoHeader} logoClassName="header-button" />
                    </div>
                    {this.state.armies.map((army) => {
                        return (
                            <div className="Army" key={"Army" + army.armyId}>
                                <ArmyDetails
                                    army={army}
                                    deleteArmy={this.deleteArmy.bind(this, army)}
                                    onUserInput={this.handleArmyInput}
                                    showArmies={this.props.showArmies}
                                    hideArmies={this.hideArmies.bind(this)} />
                            </div>
                        );
                    })}
                </div>
                <Footer updateArmies={this.updateArmies.bind(this)} showButtons={true}/>
            </div>
        );
    }
}
