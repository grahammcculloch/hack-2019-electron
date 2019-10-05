import React, { Component } from 'react';
import { Button } from '@blueprintjs/core';
import './App.scss';
const { ipcRenderer, remote } = window.require('electron');
const { dialog } = remote;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      textFile: '',
      audioFile: '',
      timingFile: '',
      backgroundFile: '',
      outputFile: '',
    };
    ipcRenderer.on('did-finish-conversion', (event, args) => {
      console.log('Received result', args)
      this.setState({ processing: false, outputFile: args.outputFile });
    });
  }

  selectTextFile = () => {
    const textFiles = dialog.showOpenDialog({
      properties: ['openFile'],
    });
    if (textFiles && textFiles.length === 1) {
      this.setState({ textFile: textFiles[0] });
    }
  };

  onGo = () => {
    this.setState({ processing: true }, () => {
      const { textFile, audioFile, timingFile, backgroundFile } = this.state;
      const args = {
        textFile,
        audioFile,
        timingFile,
        backgroundFile,
      };
      console.log('Requesting processing', args);
      ipcRenderer.send('did-start-conversion', args);
    });
  };

  render() {
    const { processing, textFile, outputFile } = this.state;
    return (
      <div className='App bp3-dark'>
        <div>
          <span>Select text file: </span>
          <Button text='Select' onClick={this.selectTextFile} />
          <span>{textFile}</span>
        </div>
        <Button loading={processing} text='Go!' onClick={this.onGo} />
        <span>{outputFile}</span>
      </div>
    );
  }
}

export default App;
