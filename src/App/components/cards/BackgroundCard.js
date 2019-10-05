import React from 'react';
import FileSelector from '../FileSelector';
import { fileFilters } from '../../constants';

class BackgroundCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { onSelectBackgroundFile } = this.props;
    return (
      <FileSelector
        label='Background file'
        options={{
          filters: fileFilters.background,
          properties: ['openFile'],
        }}
        onFileSelected={onSelectBackgroundFile}
      />
    );
  }
}

export default BackgroundCard;
