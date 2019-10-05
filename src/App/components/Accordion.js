import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Button, H3, Elevation, Icon, Intent, Collapse } from '@blueprintjs/core';
import './Accordion.scss';

@inject('store')
@observer
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
    const { cards, store: { stepStatus } } = this.props;
    const { currentCardIndex } = this.state;
    return (
      <div className="accordion">
        {cards.map((card, index) => (
          <Card key={index} className="accordion__card" elevation={Elevation.TWO}>
            <div className="accordion__card-title">
              <H3>
                <a
                  onClick={() => {
                    this.selectCard(index);
                  }}
                >
                  {card.title}
                </a>
              </H3>
              { stepStatus[index] ? <Icon icon="tick-circle" /> : null }
            </div>
            <Collapse isOpen={index === currentCardIndex}>
              <p>{card.description}</p>
              {card.content}
              <div className='accordion__card-footer'>
                <Button
                  disabled={!stepStatus[index]}
                  intent={Intent.PRIMARY}
                  onClick={() => {
                    this.onNext(index);
                  }}
                >
                  { index === (cards.length - 1) ? 'Done' : 'Next' }
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
