import localforage from "localforage"
import ConfigUtils from "./ConfigUtils";

export default class ArmyAppUtils {

  static calcPoints(squads) {
    return 0;
  }

  static async calcSchemePoints(scheme) {
    const squads = await this.getDataFromDB("squads");
    if(!squads){
      return 0;
    }
    let p = 0;
    for(let squad of squads){
      if(squad.schemeId === scheme.schemeId){
       p += parseInt(squad.points, 10); 
      }
    }
    return p;
  }

  static initLocalForage() {
    localforage.config({
      driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
      name: 'armyApp',
      version: 1.0,
      size: 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
      description: 'My army app web db'
    });
  }

  static getDataFromDB(key) {
    this.initLocalForage();
    return localforage.getItem(key).then((jsonString) => JSON.parse(jsonString));
  }

  static async getDataToExport(){
    let data ={};
    data.armies = await this.getDataFromDB("armies");
    data.schemes = await this.getDataFromDB("schemes");
    data.squads = await this.getDataFromDB("squads");
    return data;
  }

  static async updateDataFromFile(data){
    let armies = data.armies;
    let schemes = data.schemes;
    let squads = data.squads;
    const armyIdOffset = await this.getDataFromDB('armyId');
    const schemeIdOffset = await this.getDataFromDB('schemeId');
    const squadIdOffset = await this.getDataFromDB('squadId');
    if(armies){
      for(let army of armies){
        army.armyId += armyIdOffset + 1 ;
        await this.saveArmies(army);
        await this.saveObject("armyId",army.armyId  + 1);
      }
    }
    if(schemes){
      for(let scheme of schemes){
        scheme.schemeId += schemeIdOffset + 1;
        scheme.armyId += armyIdOffset + 1;
        await this.saveSchemes(scheme);
        await this.saveObject("schemeId",scheme.schemeId  + 1);

      }
    }
    if(squads){
      for(let squad of squads){
        squad.schemeId += schemeIdOffset + 1;
        squad.squadId += squadIdOffset + 1;
        await this.saveSquad(squad);
        await this.saveObject("squadId",squad.squadId  + 1);
      }
    }

  }

  static saveObject(key, value) {
    localforage.setItem(key, JSON.stringify(value));
  }

  static async addArmy(army) {
    const armyId = await this.getDataFromDB('armyId');
    army.armyId = armyId;
    await this.saveObject("armyId",armyId + 1);
    await this.saveArmies(army);
    return army;
  }

  static async saveArmies(army) {
    let armies = await this.getDataFromDB("armies");
    if (armies === null || armies.length === 0) {
      armies = [];
    }
    armies.push(army);
    this.saveObject("armies", armies);
  }
  
  static async deleteArmy(army) {
    let armies = await this.getDataFromDB("armies");
    if (armies === null || armies.length === 0) {
      armies = [];
    }
    let results=[];
    for(let a of armies){
      if(a.armyId !== army.armyId){
        results.push(a);
      }
    }
    this.deleteSchemesFromArmy(army);
    this.saveObject("armies", results);
    return results;
  }

  static async deleteSchemesFromArmy(army){
    let schemes = await this.getDataFromDB("schemes");
    if (schemes === null || schemes.length === 0) {
      schemes = [];
    }
    let results=[];
    for(let scheme of schemes){
      if(scheme.armyId !== army.armyId){
        results.push(scheme);
      }else{
        this.deleteSquadsFromScheme(scheme);
      }
    }
    this.saveObject("schemes", results);
  }

  static async deleteSquadsFromScheme(scheme){
    let squads = await this.getDataFromDB("squads");
    if (squads === null || squads.length === 0) {
      squads = [];
    }
    let results=[];
    for(let squad of squads){
      if(squad.schemeId !== scheme.schemeId){
        results.push(squad);
      }
    }
    this.saveObject("squads", results);
  }
  
  static async updateArmy(army){
    let armies = await this.getDataFromDB("armies");
    if (armies === null || armies.length === 0) {
      armies = [];
    }
    for(let i =0; i< armies.length; ++i){
      let a = armies[i];
      if(a.armyId === army.armyId){
        armies[i] = army;
      }
    }

    this.saveObject("armies", armies);
  }

  static async getSchemes(army){
    let schemes = await this.getDataFromDB("schemes");
    if (schemes === null || schemes.length === 0) {
      schemes = [];
    }
    let results = {schemes: [], points:[]};
    for(let scheme of schemes){
      if(army.armyId === scheme.armyId){
        results.schemes.push(scheme);
        let p = await this.calcSchemePoints(scheme);
        results.points[`${scheme.schemeId}`] = p;
      }
    }
    results.schemes.sort((a, b)=> {
      return a.name.localeCompare(b.name);
    });

    return results;
  }

  static async addScheme(scheme) {
    const schemeId = await this.getDataFromDB('schemeId');
    scheme.schemeId = schemeId ;
    await this.saveObject("schemeId", scheme.schemeId+ 1);
    await this.saveSchemes(scheme);
    return scheme;
  }

  static async saveSchemes(scheme) {
    let schemes = await this.getDataFromDB("schemes");
    if (schemes === null || schemes.length === 0) {
      schemes = [];
    }
    schemes.push(scheme);
    this.saveObject("schemes", schemes);
  }
  
  static async updateScheme(scheme){
    let schemes = await this.getDataFromDB("schemes");
    if (schemes === null || schemes.length === 0) {
      schemes = [];
    }
    for(let i =0; i< schemes.length; ++i){
      let s = schemes[i];
      if(s.schemeId === scheme.schemeId){
        schemes[i] = scheme;
      }
    }
    this.saveObject("schemes", schemes);
  }
  static async deleteScheme(scheme){
    let schemes = await this.getDataFromDB("schemes");
    if (schemes === null || schemes.length === 0) {
      schemes = [];
    }
    let results=[];
    for(let s of schemes){
      if(s.schemeId !== scheme.schemeId){
        results.push(s);
      }else{
        this.deleteSquadsFromScheme(scheme);
      }
    }
    this.saveObject("schemes", results);
  }

  static async duplicateScheme(scheme){
    let squads = await this.getSquads(scheme);
    let newS = await this.addScheme(scheme);
    for(let squad of squads){
      squad.schemeId = newS.schemeId;
      await this.addSquad(squad);
    }
  }

  static async addSquad(squad) {
    const squadId = await this.getDataFromDB('squadId');
    squad.squadId = squadId;
    await this.saveObject("squadId", squad.squadId+ 1);
    await this.saveSquad(squad);
    return squad;
  }

  static async saveSquad(squad) {
    let squads = await this.getDataFromDB("squads");
    if (squads === null || squads.length === 0) {
      squads = [];
    }
    squads.push(squad);
    this.saveObject("squads", squads);
  }

  static async getSquads(scheme){
    let sortValues = await ConfigUtils.getSquadsConfig();
    let squads = await this.getDataFromDB("squads");
    if (squads === null || squads.length === 0) {
      squads = [];
    }
    let results = [];
    for(let squad of squads){
      if(squad.schemeId === scheme.schemeId){
        results.push(squad);
      }
    }
    results.sort((a, b)=> {
      if(sortValues[a.type] === sortValues[b.type]){
        return a.name.localeCompare(b.name);
      }
      return sortValues[a.type] - sortValues[b.type];
    });
    return results;
  }

   static async updateSquad(squad){
    let squads = await this.getDataFromDB("squads");
    if (squads === null || squads.length === 0) {
      squads = [];
    }
    for(let i =0; i< squads.length; ++i){
      let s = squads[i];
      if(s.squadId === squad.squadId){
        squads[i] = squad;
      }
    }
    this.saveObject("squads", squads);
  }

  static async deleteSquad(squad){
    let squads = await this.getDataFromDB("squads");
    if (squads === null || squads.length === 0) {
      squads = [];
    }
    let results=[];
    for(let s of squads){
      if(s.squadId !== squad.squadId){
        results.push(s);
      }
    }
    await this.saveObject("squads", results);
    return results;
  }

  static initWebSQL() {
    localforage.setItem("armyId", JSON.stringify(0));
    localforage.setItem("schemeId", JSON.stringify(0));
    localforage.setItem("squadId", JSON.stringify(0));
  }


}