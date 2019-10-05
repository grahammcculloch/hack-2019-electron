import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import './FileSelector.scss';
const { remote } = window.require('electron');
const { dialog } = remote;

const FileSelector = ({ label, help, options, onFileSelected }) => {
  const [ fileName, setFileName ] = useState('');
  const selectFile = async () => {
    const result = await dialog.showOpenDialog(options);
    const filePaths = result.filePaths;
    const file = filePaths && filePaths.length === 1 ? filePaths[0] : '';
    if (file) {
      setFileName(file);
      onFileSelected(file);
    }
  };
  return (
    <div className="file-selector">
      <div className="file-selector__label">{label}</div>
      <Button text="Select" onClick={selectFile} />
      <div className="file-selector__filename">
        {fileName}
      </div>
    </div>
  );
};

FileSelector.propTypes = {

};

FileSelector.defaultProps = {

};

export default FileSelector;