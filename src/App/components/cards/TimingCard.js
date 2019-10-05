import React from 'react';
import FileSelector from '../FileSelector';
import { fileFilters } from '../../constants';

class TimingCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { onSelectTimingFile } = this.props;
    return (
      <FileSelector
        label='Timing file'
        options={{
          filters: fileFilters.timing,
          properties: ['openFile'],
        }}
        onFileSelected={onSelectTimingFile}
      />
    );
  }
}

export default TimingCard;
