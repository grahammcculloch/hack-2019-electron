class Lrc {
  spaces;
  metadata;
  markers;
  lines;
  wordTimings;
  
  fromLrcString(lrcString) {
    this.spaces = 0;
    this.metadata = {};
    this.markers = [];
    this.lines = [];
    this.wordTimings = [];

    var tryMatchMetadata = function (line) {
      var metadataKeys = {
        'ti': 'title',
        'ar': 'artist',
        'al': 'album',
        'art': 'art',
        'la': 'language',
        'length': 'length',
        'dif': 'difficulty',
        'relyear': 'year',
        'file': 'file'
      };

      for (var key in metadataKeys) {
        if (line.substring(0, key.length + 2) === '[' + key + ':') {
          return [metadataKeys[key], line.substring(key.length + 2, line.length - 1).trim()];
        }
      }

      return null;
    };

    var getLineData = function (line) {
      // assume there is no more than one space on a line  (and that it is at the end of the line)
      var spaceMatch = line.match(/\{([^}]+)\}/);
      var space = null;
      if (spaceMatch) {
        space = Formatter.parseTimecodeString(spaceMatch[1]);
        line = line.substring(0, line.indexOf('{'));
      }
      line = line.replace('[', '<').replace(']', '>');

      var wordParts = line.split(' ');

      var words = [];
      var wordTimings = [];

      for (let wordPart of wordParts) {
        let closeTimecodeIndex = wordPart.indexOf('>');
        let timecode = wordPart.substring(1, closeTimecodeIndex);
        let word = wordPart.substring(closeTimecodeIndex + 1).trim();

        words.push(word);
        wordTimings.push(Formatter.parseTimecodeString(timecode));
      }

      return [words, wordTimings, space];
    };

    var lines = lrcString.split('\n').filter(function (line) {
      return line.trim() !== '';
    });

    for (var line of lines) {
      let meta = tryMatchMetadata(line);
      if (meta) {
        this.metadata[meta[0]] = meta[1];
      } else {
        let data = getLineData(line);
        if (data[0].length > 0) {
          this.markers.push({
            text: data[0].join(' '),
            position: data[1][0]
          });
          this.lines.push(data[0].join(' '));
          this.wordTimings.push(data[1]);
        }

        if (data[2]) {
          this.markers.push({
            text: spaceText,
            position: data[2],
            space: true
          });

          this.spaces++;
        }
      }
    }
  };

  toLrcString() {
		var outString = '';

		// header
		outString += '[ti:' + this.metadata.title + ']\n';
		outString += '[ar:' + this.metadata.artist + ']\n';
		outString += '[al:' + this.metadata.album + ']\n';
		outString += '[art: ' + this.metadata.art + ']\n';
		outString += '[la:' + this.metadata.language + ']\n';
		outString += '[length: ' + Formatter.formatSeconds(this.waveform.length, true) + ']\n';
		outString += '[dif: ' + this.metadata.difficulty + ']\n';
		outString += '[relyear: ' + this.metadata.year + ']\n';
		outString += '[file: ' + this.metadata.file + ']\n';

		var lyricIndex = 0;
		for (var i = 0; i < this.markers.length; i++) {
			if (this.markers[i].space) {
				outString += '{' + Formatter.formatSeconds(this.markers[i].position, true) + '}';
			} else {
				outString += '\n';
				outString += '[' + Formatter.formatSeconds(this.markers[i].position, true) + ']';
				let words = this.lines[lyricIndex].split(' ');
				if (words.length > 0) {
					outString += words[0];
				}
				if (words.length > 1) {
					outString += ' ';
					for (let w = 1; w < words.length; w++) {
						outString += '<' + Formatter.formatSeconds(this.wordTimings[lyricIndex][w], true) + '>' + words[w];
						if (w !== words.length - 1) {
							outString += ' ';
						}
					}
				}
				lyricIndex++;
			}
		}

		return outString;
	};

}

export default Lrc;
