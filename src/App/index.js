import React, { Component } from 'react';
import { Button, Intent, H1 } from '@blueprintjs/core';
import Accordion from './components/Accordion';
import {
  TextAndAudioCard,
  TimingCard,
  BackgroundCard,
} from './components/cards';
import './index.scss';
const { ipcRenderer } = window.require('electron');

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

    this.cards = [
      {
        title: 'Text and Audio',
        description: 'This first step is where you provide the info.xml file from HereThis for the chapter you want.'
        + ' Then select the audio files that are in that chapter.',
        content: (
          <TextAndAudioCard
            onSelectTextFile={this.selectTextFile}
            onSelectAudioFile={this.selectAudioFile}
          />
        ),
      },
      {
        title: 'Timing',
        description: 'This is the VTT file that will be used to display the text on the screen.',
        content: <TimingCard onSelectTimingFile={this.selectTimingFile} />,
      },
      {
        title: 'Background',
        description: 'This is the background that will display when the video is playing',
        content: (
          <BackgroundCard onSelectBackgroundFile={this.selectBackgroundFile} />
        ),
      },
    ];
  }

  selectTextFile = textFile => {
    this.setState({ textFile });
  };

  selectAudioFile = audioFile => {
    this.setState({ audioFile });
  };

  selectTimingFile = timingFile => {
    this.setState({ timingFile });
  };

  selectBackgroundFile = backgroundFile => {
    this.setState({ backgroundFile });
  };

  onStart = () => {
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
    const validInputs = textFile && audioFile && timingFile && backgroundFile;
    return (
      <div className='app bp3-dark'>
        <div className='app__container'>
          <H1>Bible Karaoke</H1>
          <Accordion cards={this.cards} />
          <div className='app__footer'>
            <Button
              large
              intent={Intent.PRIMARY}
              loading={processing}
              disabled={!validInputs}
              text='Start'
              onClick={this.onStart}
            />
          </div>
          <span>{outputFile}</span>
          <div className='app__footer'>
            <Button
              large
              intent={Intent.PRIMARY}
              loading={processing}
              text='Start'
              onClick={this.onRender}
            />
          </div>
          <span>{renderFile}</span>
        </div>
      </div>
    );
  }
}

export default App;
