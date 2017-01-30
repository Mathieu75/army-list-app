import React, { Component } from 'react';
import ArmyAppUtils from './Utils/ArmyAppUtils';

export default class Footer extends Component {
  constructor(props){
    super(props)
    this.state ={armies : this.props.armies?this.props.armies:{},showButtons: this.props.showButtons};
    this.exportArmies = this.exportArmies.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.readFile = this.readFile.bind(this);
  }

  exportArmies(){
    
    ArmyAppUtils.getDataToExport().then((datas)=>{
    let data = new Blob([JSON.stringify(datas)], {type: 'application/json'});
      
      let textFile;
      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      let url = window.URL.createObjectURL(data);
      let tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute('download', 'army-app.json');
      tempLink.click();
    });
  }

  handleFileSelected(event){
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.addEventListener('load', this.readFile.bind(this));
      reader.readAsText(file);
  }
  
  readFile(event) {
    ArmyAppUtils.updateDataFromFile(JSON.parse(event.target.result)).then(()=>{
      this.props.updateArmies();
    });
  }
  
  render() {
    
    if (this.state.showButtons) {
      return (
        <div className="App-Footer">
          <div className="export" onClick={this.exportArmies}>
            export
          </div>
          <div className="import">
            import
            <input type="file" id="files" name="files" onChange={this.handleFileSelected}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="App-Footer">
        </div>
      );
    }
  }
}
