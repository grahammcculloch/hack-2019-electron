import React from 'react';
import { Button } from '@blueprintjs/core';
import './FileSelector.scss';
const { remote } = window.require('electron');
const { dialog } = remote;

const FileSelector = ({ file, label, help, options, onFileSelected }) => {
  const selectFile = async () => {
    const result = await dialog.showOpenDialog(options);
    const filePaths = result.filePaths;
    const file = filePaths && filePaths.length === 1 ? filePaths[0] : '';
    if (file) {
      onFileSelected(file);
    }
  };
  return (
    <div className="file-selector">
      <div className="file-selector__label">{label}</div>
      <Button text="Select" onClick={selectFile} />
      <div className="file-selector__filename">
        {file}
      </div>
    </div>
  );
};

FileSelector.propTypes = {

};

FileSelector.defaultProps = {

};

export default FileSelector;