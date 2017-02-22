import React, { Component } from 'react';
import BtnAdd from './BtnAdd';
import BtnDelete from './BtnDelete';
import BtnDuplicate from './BtnDuplicate';
import BtnEdit from './BtnEdit';
import BtnMenu from './BtnMenu';

export default class MyMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expended: true,
            defaultLogo: this.props.defaultLogo ? this.props.defaultLogo : "w",
            menuColor:this.props.defaultLogo ? this.props.defaultLogo : "w" ,
            showButtons: {},
            showDelete: false,
            toogleEdit: true,
            toggleAdd: true
        };
        this.showMenuList = this.showMenuList.bind(this);
        this.toogle = this.toogle.bind(this);
        this.toogleEditButton = this.toogleEditButton.bind(this);
        this.toogleAddButton = this.toogleAddButton.bind(this);
        this.handleDelete = this.handleDelete.bind(this); 
        this.tooglePopupDelete = this.tooglePopupDelete.bind(this);
        this.renderPopupDelete = this.renderPopupDelete.bind(this);
    }
    toogleEditButton() {
        const sds = this.state.showButtons;
        if (this.state.toogleEdit) {
            sds['edit'] = <div className="button" key='buttonEdit' onClick={this.toogleEditButton}><BtnEdit logo="o" /></div>;
        } else {
            sds['edit'] = <div className="button" key='buttonEdit' onClick={this.toogleEditButton}><BtnEdit logo={this.state.defaultLogo} /></div>;
        }
        this.props.edit();
        this.setState({ showButtons: sds, toogleEdit: !this.state.toogleEdit });

    }
    toogleAddButton() {
        const sds = this.state.showButtons;
        if (this.state.toggleAdd) {
            sds['add'] = <div className="button" onClick={this.toogleAddButton} ><BtnAdd logo="o"/></div>;
        } else {
            sds['add'] = <div className="button" onClick={this.toogleAddButton} ><BtnAdd logo={this.state.defaultLogo}/></div>;
        }
        this.props.add();
        this.setState({ showButtons: sds, toggleAdd: !this.state.toggleAdd });

    }
    showMenuList() {
        let sds = {};
        this.setState({ showButtons: sds });
        if (this.state.expended) {

            if (this.props.add && this.state.toggleAdd) {
                sds['add'] = <div className="button" onClick={this.toogleAddButton} ><BtnAdd logo={this.state.defaultLogo}/></div>;
            }

            if (this.props.add && !this.state.toggleAdd) {
                sds['add'] = <div className="button" onClick={this.toogleAddButton} ><BtnAdd logo="o"/></div>;
            }

            if (this.props.edit && this.state.toogleEdit) {
                sds['edit'] = <div className="button" onClick={this.toogleEditButton} ><BtnEdit logo={this.state.defaultLogo} /></div>;
            }


            if (this.props.edit && !this.state.toogleEdit) {
                sds['edit'] = <div className="button" onClick={this.toogleEditButton} ><BtnEdit logo="o" /></div>;
            }

            if (this.props.duplicate) {
                sds['duplicate'] = <div className="button" onClick={this.props.duplicate} ><BtnDuplicate logo={this.state.defaultLogo}  /></div>;
            }
            if (this.props.delete) {
                sds['delete'] = <div className="button" onClick={this.tooglePopupDelete.bind(this)} ><BtnDelete logo={this.state.defaultLogo} /></div>;
            }
            this.setState({ menuList: sds });
        }
    }

    toogle(e) {
        e.preventDefault();
        this.setState(prevState => ({
            expended: !prevState.expended,
            menuColor: !prevState.expended? this.state.defaultLogo:'o'
        }));
        this.showMenuList();
    }

    handleDelete(){
        this.tooglePopupDelete();
        this.props.delete();
    }

    tooglePopupDelete(){
        this.setState({showDelete: !this.state.showDelete});
    }

    renderPopupDelete(){
        if(this.state.showDelete){
            return(
            <div className="popup-background" onClick={this.tooglePopupDelete.bind(this)}>
                <div className="popup">
                    <div className="popup-content">
                        <div>
                            Etes-vous sûr de vouloir supprimer cet élément?
                        </div>
                        <div className="popup-buttons"> 
                            <div className="button" onClick={this.handleDelete.bind(this)} >OK</div>
                            <div className="button" onClick={this.tooglePopupDelete.bind(this)} >CANCEL</div>
                        </div>
                    </div>
                </div>
            </div>
        );
        }else{
            return null;
        }
    }

    render() {
        return (
            <div className="Menu">
                <div className="Menu-List">
                    <div className="button" onClick={this.toogle}><BtnMenu logo={this.state.menuColor}/></div>
                    {this.state.showButtons['add']}
                    {this.state.showButtons['close']}
                    {this.state.showButtons['edit']}
                    {this.state.showButtons['duplicate']}
                    {this.state.showButtons['delete']}
                </div>
                {this.renderPopupDelete()}
            </div>
        );
    }

}