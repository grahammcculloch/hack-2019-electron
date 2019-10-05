import React from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import './TextAndAudioCard.scss';
const { ipcRenderer } = window.require('electron');

class TextAndAudioCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProject: undefined,
      selectedBook: undefined,
      selectedChapter: undefined,
    };
    ipcRenderer.on('did-finish-getprojectstructure', (event, projects) => {
      console.log('Received project structure', projects);
      this.setState({
        projects,
        selectedProject: undefined,
        selectedBook: undefined,
        selectedChapter: undefined,
      });
    });
  }

  componentDidMount() {
    ipcRenderer.send('did-start-getprojectstructure');
  }

  selectProject = evt => {
    this.setState({
      selectedProject: evt.currentTarget.value,
    });
  };

  selectBook = evt => {
    this.setState({
      selectedBook: evt.currentTarget.value,
    });
  };

  selectChapter = evt => {
    this.setState({
      selectedChapter: evt.currentTarget.value,
    });
  };

  render() {
    const {
      projects,
      selectedProject,
      selectedBook,
      selectedChapter,
    } = this.state;
    const { onSelectFolder } = this.props;
    const projectOptions = projects.map((p, index) => ({
      value: index,
      label: p.name,
    }));
    const bookOptions =
      selectedProject !== undefined
        ? projects[selectedProject].books.map((p, index) => ({
            value: index,
            label: p.name,
          }))
        : undefined;
    const chapterOptions =
      selectedProject !== undefined && selectedBook !== undefined
        ? projects[selectedProject].books[selectedBook].chapters.map(
            (p, index) => ({
              value: index,
              label: p.name,
            }),
          )
        : undefined;
    return (
      <div>
        <div className='card__option'>
          <div className='card__option-label'>Project</div>
          <HTMLSelect
            value={selectedProject}
            onChange={this.selectProject}
            options={[{ value: undefined, label: 'Select...' }].concat(
              projectOptions,
            )}
          />
        </div>
        <div className='card__option'>
          <div className='card__option-label'>Book</div>
          <HTMLSelect
            disabled={selectedProject === undefined}
            value={selectedBook}
            onChange={this.selectBook}
            options={[{ value: undefined, label: 'Select...' }].concat(
              bookOptions,
            )}
          />
        </div>
        <div className='card__option'>
          <div className='card__option-label'>Chapter</div>
          <HTMLSelect
            disabled={selectedBook === undefined}
            value={selectedChapter}
            onChange={this.selectChapter}
            options={[{ value: undefined, label: 'Select...' }].concat(
              chapterOptions,
            )}
          />
        </div>
      </div>
    );
  }
}

TextAndAudioCard.propTypes = {};

TextAndAudioCard.defaultProps = {};

export default TextAndAudioCard;
