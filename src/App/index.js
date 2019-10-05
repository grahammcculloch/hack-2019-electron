import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Intent, H1 } from '@blueprintjs/core';
import Accordion from './components/Accordion';
import {
  TextAndAudioCard,
  // TimingCard,
  BackgroundCard,
} from './components/cards';
import './index.scss';
const { ipcRenderer } = window.require('electron');

@inject('store')
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      rendering: false,
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
          'Finally, select a background image or video that will be used as the background of the generated video',
        content: <BackgroundCard />,
      },
    ];
  }

  onStart = () => {
    this.setState({ processing: true }, () => {
      const { hearThisFolder, timingFile, backgroundFile } = this.props.store;
      const args = {
        hearThisFolder,
        timingFile,
        backgroundFile,
      };
      console.log('Requesting processing', args);
      ipcRenderer.send('did-start-conversion', args);
    });
  };

  onRender = () => {
    this.setState({ rendering: true }, () => {
      const { hearThisFolder, timingFile, backgroundFile } = this.props.store;
      const args = {
        hearThisFolder,
        timingFile,
        backgroundFile,
      };
      console.log('Requesting render', args);
      ipcRenderer.send('did-start-render', args);
    });
  };

  render() {
    const { processing } = this.state;
    const {
      store: { allValidInputs },
    } = this.props;
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
              disabled={!allValidInputs}
              text='Make my video!'
              onClick={this.onStart}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
