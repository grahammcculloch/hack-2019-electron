import React from 'react';
import { inject, observer } from 'mobx-react';
import FileSelector from '../FileSelector';
import { fileFilters } from '../../constants';
const wavelyric = require('./wavelyric/index.html');

@inject('store')
@observer
class TimingCard extends React.PureComponent {
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
          <iframe src={wavelyric}></iframe>
        </div>
      </div>
    );
  }
}

export default TimingCard;
