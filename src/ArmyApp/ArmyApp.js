import React, { Component } from 'react';
import ArmyAppUtils from './Utils/ArmyAppUtils';
import ArmyList from './ArmyList';
import Slider from '../generic/Slider'
import Config from './config/Config'
import logoApp from '../images/logo.png';
import logoConfig from '../images/config_o.png';

export default class ArmyApp extends Component {
    constructor() {
        super();
        this.state = {
            content: [],
            menuItems: [
                {
                    type: "ArmyList",
                    logo: <img src={logoApp} className="App-logo" alt="logo" />,
                    content: <ArmyList key={"ArmyList-content"} switchContent={this.switchContent.bind(this)} showArmies={this.showArmies.bind(this)} />
                },
                {
                    type: "Config",
                    logo: <img src={logoConfig} className="App-logo" alt="logo" />,
                    content: <Config key={"config-content"} />
                }
            ]
        };
        this.updateArmies = this.updateArmies.bind(this);
        this.switchContent = this.switchContent.bind(this);
        this.showArmies = this.showArmies.bind(this);
    }

    updateArmies() {
        const content = [];
        ArmyAppUtils.getDataFromDB("armies").then((armiesFromDb) => {
            if (armiesFromDb == null || armiesFromDb.length === 0) {
                armiesFromDb = [];
                ArmyAppUtils.initWebSQL();
            }
            content.push(this.state.menuItems[0].content);
            this.setState({ content: content });
        });
    }

    componentWillMount() {
        this.showArmies();


    }

    switchContent(item) {
        let content = [];
        content.push(item.content);
        this.setState({ content: content });
    }

    showArmies() {
        this.switchContent(this.state.menuItems[0]);
    }

    render() {
        return (
            <div className="Army-app">
                <Slider menuItems={this.state.menuItems} switchContent={this.switchContent.bind(this)} />
                {this.state.content}
            </div>
        );
    }
}
