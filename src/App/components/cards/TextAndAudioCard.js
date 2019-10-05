import React from 'react';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import FileSelector from '../FileSelector';
import { fileFilters } from '../../constants';
import { getProjectStructure } from '../../../here-this';

class TextAndAudioCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      useHearThis: false,
      hereThisProjects: []
    };
  }

  selectHearThis = () => {
    this.setState({ useHearThis: true, hereThisProjects: getProjectStructure() });
  };

  selectManualSelection = () => {
    this.setState({ useHearThis: false });
  };

  render() {
    const { useHearThis, hereThisProjects } = this.state;
    const { onSelectTextFile, onSelectAudioFile } = this.props;
    
    return (
      <React.Fragment>
        <ButtonGroup>
          <Button
            onClick={this.selectManualSelection}
            intent={useHearThis ? undefined : Intent.PRIMARY}
          >
            Manual Selection
          </Button>
          <Button
            onClick={this.selectHearThis}
            intent={useHearThis ? Intent.PRIMARY : undefined}
          >
            HearThis
          </Button>
        </ButtonGroup>
        {useHearThis ? (
          <div>here this</div>
        ) : (
          <div>
            <FileSelector
              label='Text file'
              options={{
                filters: fileFilters.text,
                properties: ['openFile'],
              }}
              onFileSelected={onSelectTextFile}
            />
            <FileSelector
              label='Audio file'
              options={{
                filters: fileFilters.audio,
                properties: ['openFile'],
              }}
              onFileSelected={onSelectAudioFile}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

TextAndAudioCard.propTypes = {};

TextAndAudioCard.defaultProps = {};

export default TextAndAudioCard;
