import localforage from "localforage"

export default class ConfigUtils {

  static getDataFromDB(key) {
    return localforage.getItem(key).then((jsonString) => JSON.parse(jsonString));
  }

  static saveObject(key, value) {
    localforage.setItem(key, JSON.stringify(value));
  }


  static async getConfig() {
    let config = await this.getDataFromDB("config");
    let save = false;
    if(!config){
        config = {};
        save = true;
    }
    if(!config.squads){
        config.squads ={
        "t":2,
        "e":3,
        "q":1,
        "s":5,
        "r":4 
      };
      save = true;
    }
    if(save){
      this.saveObject("config",config);
    }
    return config;
  }

static async getSquadsConfig() {
    let config = await this.getConfig();
    return config.squads;
  }

}