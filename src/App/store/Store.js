import { observable, computed, action } from "mobx";

class Store {
  @observable 
  hearThisFolder = '';
  
  @observable 
  timingFile = '';
  
  @observable 
  backgroundFile = '';

  @computed
  get stepStatus() {
    return [
      !!this.hearThisFolder,
      // !!this.timingFile,
      !!this.backgroundFile,
    ];
  }

  @action.bound
  setHearThisFolder(folder) {
    console.log('Setting hear this folder', folder);
    this.hearThisFolder = folder;
  }

  @action.bound
  setTimingFile(file) {
    this.timingFile = file;
  }
  
  @action.bound
  setBackgroundFile(file) {
    this.backgroundFile = file;
  }

  @computed
  get allValidInputs() {
    return this.hearThisFolder && /* this.timingFile && */ this.backgroundFile;
  }
}

export default Store;