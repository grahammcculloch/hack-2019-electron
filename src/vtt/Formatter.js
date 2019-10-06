class Formatter {
  static formatSeconds (seconds, padMinutes) {
    var secondsOutput = (seconds % 60).toFixed(2);
    if (secondsOutput.length === 4)
      secondsOutput = '0' + secondsOutput;

    var minutes = Math.floor(seconds / 60);
    var minutesOutput = '' + minutes;
    if (padMinutes && minutesOutput.length === 1) {
      minutesOutput = '0' + minutesOutput;
    }

    var output = minutesOutput + ':' + secondsOutput;

    return output;
  }

  static parseTimecodeString (timecodeString) {
    var matches = timecodeString.match(/([0-9]+):([0-9][0-9]\.([0-9]+)?)/);

    if (matches) {
      let minutes = parseInt(matches[1]);
      let seconds = parseFloat(matches[2]);

      return minutes * 60 + seconds;
    } else {
      return 0;
    }
  }
}

export default Formatter;
