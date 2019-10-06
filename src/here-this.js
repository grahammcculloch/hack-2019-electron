const fs  = require('fs');
const path = require('path');

module.exports = {
    getProjectStructure
};

class Project {
    constructor() {
        this.name = '';
        this.books = [];
    }
};

class Book {
    constructor() {

        this.name = '';
        this.chapters = [];
    }
}

class Chapter {
    constructor() {
        this.name = '';
        this.fullPath = '';
        this.audioFiles = [];
        this.textXmlFile = '';
    }
}
const DEFAULT_XML_NAME = 'info.xml';
// const DEFAULT_DATA_DIR = 'C:/ProgramData/SIL/HearThis/';
const DEFAULT_DATA_DIR = '/home/hahnkev/hereThisProjects/';
function getProjectStructure() {
    try {
        let projectNames = fs.readdirSync(DEFAULT_DATA_DIR);
        let projects = projectNames.map(name => makeProject(name));

        return projects;
    } catch {
        return [];
    }
}

function makeProject(name) {
    let project = new Project();
    project.name = name;
    const bookNames = fs.readdirSync(path.join(DEFAULT_DATA_DIR, name)).filter(folderName => !folderName.endsWith('.xml'));
    project.books = bookNames.map(bookName => makeBook(name, bookName))
        .filter(book => book.chapters.length);
    return project;
}

function makeBook(projectName, name) {
    let book = new Book();
    book.name = name;
    let chapterNames = fs.readdirSync(path.join(DEFAULT_DATA_DIR, projectName, name));
    book.chapters = chapterNames.map(chapterName => makeChapter(projectName, name, chapterName))
        .filter(chapter => chapter.audioFiles.length > 0);
    return book;
}

function makeChapter(projectName, bookName, name) {
    let chapter = new Chapter();
    chapter.name = (parseInt(name) + 1).toString();
    let chapterFiles = fs.readdirSync(path.join(DEFAULT_DATA_DIR, projectName, bookName, name));
    chapter.audioFiles = chapterFiles.filter(file => file != DEFAULT_XML_NAME)
        .map(fileName => path.join(DEFAULT_DATA_DIR, projectName, bookName, name, fileName));

    chapter.textXmlFile = chapterFiles.find(file => file == DEFAULT_XML_NAME);
    if (chapter.textXmlFile) chapter.textXmlFile = path.join(DEFAULT_DATA_DIR, projectName, bookName, name, chapter.textXmlFile);
    chapter.fullPath = path.join(DEFAULT_DATA_DIR, projectName, bookName, name);
    return chapter;
}
console.log(JSON.stringify(getProjectStructure()));