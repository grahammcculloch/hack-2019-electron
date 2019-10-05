import React from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import { inject, observer } from 'mobx-react';
const { ipcRenderer } = window.require('electron');

const noSelection = -1;
const emptyOption = { value: noSelection, label: 'Select....' };

@inject('store')
@observer
class TextAndAudioCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProject: noSelection,
      selectedBook: noSelection,
      selectedChapter: noSelection,
    };
    ipcRenderer.on('did-finish-getprojectstructure', (event, projects) => {
      console.log('Received project structure', projects);
      this.setState({
        projects,
        selectedProject: noSelection,
        selectedBook: noSelection,
        selectedChapter: noSelection,
      });
    });
  }

  componentDidMount() {
    console.log('componentDidMount', this.props);
    ipcRenderer.send('did-start-getprojectstructure');
  }

  selectProject = evt => {
    this.setState({
      selectedProject: parseInt(evt.currentTarget.value, 10),
      selectedBook: noSelection,
      selectedChapter: noSelection,
    }, () => {
      this.checkFolder();
    });
  };

  selectBook = evt => {
    this.setState({
      selectedBook: parseInt(evt.currentTarget.value, 10),
      selectedChapter: noSelection,
    }, () => {
      this.checkFolder();
    });
  };

  selectChapter = evt => {
    this.setState({
      selectedChapter: parseInt(evt.currentTarget.value, 10),
    }, () => {
      this.checkFolder();
    });
  };

  checkFolder = () => {
    const { projects, selectedProject, selectedBook, selectedChapter } = this.state;
    const { store: { setHearThisFolder }} = this.props;
    if (selectedChapter !== noSelection) {
      const hearThisChapterFolder = projects[selectedProject].books[selectedBook].chapters[selectedChapter].fullPath;
      setHearThisFolder(hearThisChapterFolder);
    } else {
      setHearThisFolder(undefined);
    }
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
      selectedProject !== noSelection
        ? projects[selectedProject].books.map((p, index) => ({
            value: index,
            label: p.name,
          }))
        : [];
    const chapterOptions =
      selectedBook !== noSelection
        ? projects[selectedProject].books[selectedBook].chapters.map(
            (p, index) => ({
              value: index,
              label: p.name,
            }),
          )
        : [];
    return (
      <div>
        <div className='card__option'>
          <div className='card__option-label'>Project</div>
          <HTMLSelect
            value={selectedProject}
            onChange={this.selectProject}
            options={[emptyOption].concat(projectOptions)}
          />
        </div>
        <div className='card__option'>
          <div className='card__option-label'>Book</div>
          <HTMLSelect
            disabled={selectedProject === -1}
            value={selectedBook}
            onChange={this.selectBook}
            options={[emptyOption].concat(bookOptions)}
          />
        </div>
        <div className='card__option'>
          <div className='card__option-label'>Chapter</div>
          <HTMLSelect
            disabled={selectedBook === -1}
            value={selectedChapter}
            onChange={this.selectChapter}
            options={[emptyOption].concat(chapterOptions)}
          />
        </div>
      </div>
    );
  }
}

TextAndAudioCard.propTypes = {};

TextAndAudioCard.defaultProps = {};

export default TextAndAudioCard;
