import React from 'react';
import { inject, observer } from 'mobx-react';
import { Intent, H1, H6, Classes, Callout } from '@blueprintjs/core';
import Accordion from './components/Accordion';
import { cards } from './components/cards';
import ActionButton from './components/ActionButton';
import './index.scss';
const { ipcRenderer } = window.require('electron');

const AppStatus = {
  configuring: 'configuring',
  processing: 'processing',
  done: 'done',
  error: 'error',
};

@inject('store')
@observer
class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: AppStatus.configuring,
      error: undefined,
    };
    ipcRenderer.on('did-finish-conversion', (event, args) => {
      console.log('Received result', args);
      if (args.outputFile) {
        this.setState({ status: AppStatus.done });
      } else {
        this.setState({
          status: AppStatus.error,
          error: args.error,
        });
      }
    });
  }

  reset = () => {
    this.setState({
      status: AppStatus.configuring,
      error: undefined,
    });
  };

  openOutputFolder = () => {
    const { outputFile } = this.props.store;
    ipcRenderer.send('open-output-folder', outputFile);
    this.setState({ status: AppStatus.configuring });
  };

  onStart = () => {
    this.setState({ status: AppStatus.processing }, () => {
      const { hearThisFolder, backgroundFile, font, outputFile } = this.props.store;
      const args = {
        hearThisFolder,
        backgroundFile,
        font,
        outputFile,
      };
      console.log('Requesting processing', args);
      ipcRenderer.send('did-start-conversion', args);
    });
  };

  renderFooter() {
    const {
      store: { allValidInputs },
    } = this.props;
    const { error, status } = this.state;
    if (status === AppStatus.done) {
      return (
        <ActionButton
          large
          intent={Intent.PRIMARY}
          text='Open output folder'
          onClick={this.openOutputFolder}
        />
      );
    } else if (status === AppStatus.error) {
      return (
        <Callout title='Uh-oh!' intent={Intent.DANGER}>
          <p>Looks like something went wrong.</p>
          <H6>Details</H6>
          <p className={Classes.TEXT_MUTED}>{error.message}</p>
          <ActionButton onClick={this.reset} text='OK' />
        </Callout>
      );
    }
    return (
      <ActionButton
        large
        intent={Intent.PRIMARY}
        loading={status === AppStatus.processing}
        disabled={!allValidInputs}
        text='Make my video!'
        onClick={this.onStart}
      />
    );
  }

  render() {
    return (
      <div className='app bp3-dark'>
        <div className='app__container'>
          <H1>Bible Karaoke</H1>
          <Accordion cards={cards} />
          <div className='app__footer'>{this.renderFooter()}</div>
        </div>
      </div>
    );
  }
}

export default App;
