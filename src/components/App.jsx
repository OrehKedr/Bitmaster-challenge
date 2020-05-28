import React from 'react';

export default class App extends React.Component {
  state = {
    text: 'Наш первый React-компонент'
  };

  render() {
    return (
    <h1>{this.state.text}</h1>
    )
  }
}