import React from 'react';
import { inject, observer } from 'mobx-react';
import FileSelector from '../FileSelector';
import { fileFilters } from '../../constants';
const wavelyricHtml = require('./wavelyric/index.html.js');

@inject('store')
@observer
class TimingCard extends React.PureComponent {
  componentDidMount () {
    angular.bootstrap(this.container, ['wavelyricApp']);
  }

  render() {
    const {
      store: { timingFile, setTimingFile },
    } = this.props;
    return (
      <div>
        <FileSelector
          file={timingFile}
          label='Timing file'
          options={{
            title: 'Select Timing File',
            filters: fileFilters.timing,
            properties: ['openFile'],
          }}
          onFileSelected={setTimingFile}
        />
        <div>
          <p>WaveLyric goes here</p>
          <div ref={c => this.container = c} dangerouslySetInnerHTML={{__html: wavelyricHtml}}></div>
        </div>
      </div>
    );
  }
}

export default TimingCard;
