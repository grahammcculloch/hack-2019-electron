import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Intent, H1 } from '@blueprintjs/core';
import Accordion from './components/Accordion';
import {
  TextAndAudioCard,
  // TimingCard,
  BackgroundCard,
  OutputCard,
} from './components/cards';
import './index.scss';
const { ipcRenderer } = window.require('electron');

const AppStatus = {
  configuring: 'configuring',
  processing: 'processing',
  done: 'done',
};

@inject('store')
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: AppStatus.configuring,
    };
    ipcRenderer.on('did-finish-conversion', (event, args) => {
      console.log('Received result', args);
      this.setState({ status: AppStatus.done });
    });

    this.cards = [
      {
        title: 'Text and Audio',
        description:
          'This first step is where you select the HereThis project, book and chapter.' +
          ' This folder should contain the text and audio files that will be used in the video.',
        content: <TextAndAudioCard />,
      },
      // {
      //   title: 'Timing',
      //   description:
      //     'Now select the VTT file that will be used to display the text on the screen.',
      //   content: <TimingCard />,
      // },
      {
        title: 'Background',
        description:
          'Then select a background image or video that will be used as the background of the generated video',
        content: <BackgroundCard />,
      },
      {
        title: 'Output',
        description: "Finally, select where you'll save the generated video",
        content: <OutputCard />,
      },
    ];
  }

  openOutputFolder = () => {
    const { outputFile } = this.props.store;
    ipcRenderer.send('open-output-folder', outputFile);
    this.setState({ status: AppStatus.configuring });
  };

  onStart = () => {
    this.setState({ status: AppStatus.processing }, () => {
      const { hearThisFolder, backgroundFile, outputFile } = this.props.store;
      const args = {
        hearThisFolder,
        backgroundFile,
        outputFile,
      };
      console.log('Requesting processing', args);
      ipcRenderer.send('did-start-conversion', args);
    });
  };

  render() {
    const { status } = this.state;
    const {
      store: { allValidInputs },
    } = this.props;
    return (
      <div className='app bp3-dark'>
        <div className='app__container'>
          <H1>Bible Karaoke</H1>
          <Accordion cards={this.cards} />
          <div className='app__footer'>
            {status === AppStatus.done ? (
              <Button
                large
                intent={Intent.PRIMARY}
                text='Open output folder'
                onClick={this.openOutputFolder}
              />
            ) : (
              <Button
                large
                intent={Intent.PRIMARY}
                loading={status === AppStatus.processing}
                disabled={!allValidInputs}
                text='Make my video!'
                onClick={this.onStart}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
