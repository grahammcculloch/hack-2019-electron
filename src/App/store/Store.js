import { observable, computed, action } from "mobx";
import path from 'path';

class Store {
  @observable 
  hearThisFolder = '';
  
  @observable 
  timingFile = '';
  
  @observable 
  backgroundFile = '';

  @observable 
  outputFile = '';

  @observable
  hearThisProjects = [];

  @computed
  get defaultVideoName() {
    if (!this.hearThisFolder) {
      return 'bible-karaoke.mp4';
    }
    // Name the video by book and chapter (e.g. 'Mark2.mp4')
    const dirs = this.hearThisFolder.split(/[\/\\]/);
    return `${dirs[dirs.length - 2]}${dirs[dirs.length - 1]}.mp4`;
  }

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
  setHearThisProjects(projects) {
    this.hearThisProjects = projects;
    this.hearThisFolder = '';
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