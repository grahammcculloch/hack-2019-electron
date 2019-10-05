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
      rendering: false,
      textFile: '',
      audioFile: '',
      timingFile: '',
      backgroundFile: '',
      outputFile: '',
      renderFile: '',
    };
    ipcRenderer.on('did-finish-conversion', (event, args) => {
      console.log('Received result', args);
      this.setState({ processing: false, outputFile: args.outputFile });
    });
    ipcRenderer.on('did-finish-render', (event, args) => {
      console.log('Received result', args);
      this.setState({ rendering: false, renderFile: args.outputFile });
    });
  }

  selectTextFile = () => {
    const textFile = this.selectFile({
      filters: [{
        name: 'Text files',
        extensions: ["txt"]
      }],
      properties: ['openFile'],
    });
    this.setState({ textFile });
  };

  selectAudioFile = () => {
    const audioFile = this.selectFile({
      filters: [{
        name: 'MP3 files',
        extensions: ["mp3"]
      }],
      properties: ['openFile'],
    });
    this.setState({ audioFile });
  };

  selectTimingFile = () => {
    const timingFile = this.selectFile({
      filters: [{
        name: 'Timing files',
        extensions: ["txt"]
      }],
      properties: ['openFile'],
    });
    this.setState({ timingFile });
  };

  selectBackgroundFile = () => {
    const backgroundFile = this.selectFile({
      filters: [{
        name: 'Image files',
        extensions: ["jpg"]
      }],
      properties: ['openFile'],
    });
    this.setState({ backgroundFile });
  };

  selectFile = options => {
    const files = dialog.showOpenDialog(options);
    return files && files.length === 1 ? files[0] : '';
  }

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

  onRender = () => {
    this.setState({ rendering: true }, () => {
      const { textFile, audioFile, timingFile, backgroundFile } = this.state;
      const args = {
        textFile,
        audioFile,
        timingFile,
        backgroundFile,
      };
      console.log('Requesting render', args);
      ipcRenderer.send('did-start-render', args);
    });
  };

  render() {
    const {
      processing,
      rendering,
      textFile,
      audioFile,
      timingFile,
      backgroundFile,
      outputFile,
      renderFile,
    } = this.state;
    return (
      <div className='App bp3-dark'>
        <div>
          <span>Select text file: </span>
          <Button text='Select' onClick={this.selectTextFile} />
          <span>{textFile}</span>
        </div>
        <div>
          <span>Audio file: </span>
          <Button text='Select' onClick={this.selectAudioFile} />
          <span>{audioFile}</span>
        </div>
        <div>
          <span>Timing file: </span>
          <Button text='Select' onClick={this.selectTimingFile} />
          <span>{timingFile}</span>
        </div>
        <div>
          <span>Background file: </span>
          <Button text='Select' onClick={this.selectBackgroundFile} />
          <span>{backgroundFile}</span>
        </div>
        <div>
        <Button loading={processing} text='Go!' onClick={this.onGo} />
        <span>{outputFile}</span>
        </div>
        <div>
        <Button loading={rendering} text='Render!!' onClick={this.onRender} />
        <span>{renderFile}</span>
        </div>
      </div>
    );
  }
}

export default App;
