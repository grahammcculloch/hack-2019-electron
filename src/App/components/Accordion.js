import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, H3, Elevation, Intent, Collapse } from '@blueprintjs/core';
import './Accordion.scss';

class Accordion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentCardIndex: 0,
    };
  }

  selectCard = cardIndex => {
    this.setState({ currentCardIndex: cardIndex });
  };

  onNext = index => {
    const { cards } = this.props;
    const nextIndex = index < cards.length - 1 ? index + 1 : null;
    this.setState({ currentCardIndex: nextIndex });
  };

  render() {
    const { cards } = this.props;
    const { currentCardIndex } = this.state;
    return (
      <div className="accordion">
        {cards.map((card, index) => (
          <Card className="accordion__card" elevation={Elevation.TWO}>
            <H3>
              <a
                onClick={() => {
                  this.selectCard(index);
                }}
              >
                {card.title}
              </a>
            </H3>
            <p>{card.description}</p>
            <Collapse isOpen={index === currentCardIndex}>
              {card.content}
              <div className='accordion__card-footer'>
                <Button
                  intent={Intent.PRIMARY}
                  onClick={() => {
                    this.onNext(index);
                  }}
                >
                  Next
                </Button>
              </div>
            </Collapse>
          </Card>
        ))}
      </div>
    );
  }
}

Accordion.propTypes = {};

Accordion.defaultProps = {};

export default Accordion;
