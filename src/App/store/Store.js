import { observable, computed, action } from "mobx";

class Store {
  @observable 
  hearThisFolder = '';
  
  @observable 
  timingFile = '';
  
  @observable 
  backgroundFile = '';

  @observable 
  outputFile = '';

  @computed
  get stepStatus() {
    return [
      !!this.hearThisFolder,
      // !!this.timingFile,
      !!this.backgroundFile,
      !!this.outputFile,
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

  @action.bound
  setOutputFile(file) {
    this.outputFile = file;
  }

  @computed
  get allValidInputs() {
    return this.hearThisFolder && /* this.timingFile && */ this.backgroundFile && this.outputFile;
  }
}

export default Store;