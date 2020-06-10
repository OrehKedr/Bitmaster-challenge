import React from 'react';
import PropTypes from 'prop-types';
import '../styles/modal.css';

export default class Modal extends React.Component {
  static propTypes = {
    orderID: PropTypes.number.isRequired,
    toggleOpen: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.toggleOpen();
  }

  render() {
    const { orderID } = this.props;

    return (
      <div className='modal'>
        <div className='modal-body'>
          <h2>Информация о заказе.</h2>
          <p>Номер заказа: {orderID}</p>
          <button className='modal-btn-close' onClick={this.handleClick}>Закрыть</button>
        </div>
      </div>
    )
  }
}