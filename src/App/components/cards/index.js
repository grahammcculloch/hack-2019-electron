import React from 'react';

import TextAndAudioCard from './TextAndAudioCard';
// import TimingCard from './TimingCard';
import BackgroundCard from './BackgroundCard';
import OutputCard from './OutputCard';

export {
  TextAndAudioCard,
  // TimingCard,
  BackgroundCard,
  OutputCard,
};

export const cards = [
  {
    title: 'Text and Audio',
    description:
      'This first step is where you select the HereThis project, book and chapter.' +
      ' This folder should contain the text and audio files that will be used in the video.',
    content: <TextAndAudioCard />,
  },
  // {
  //   title: 'Timing',
  //   description:
  //     'Now select the VTT file that will be used to display the text on the screen.',
  //   content: <TimingCard />,
  // },
  {
    title: 'Background',
    description:
      'Then select a background image or video that will be used as the background of the generated video',
    content: <BackgroundCard />,
  },
  {
    title: 'Output',
    description: "Finally, select where you'll save the generated video",
    content: <OutputCard />,
  },
];
