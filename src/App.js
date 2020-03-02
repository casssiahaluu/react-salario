import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { interval, timer, Observable } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';

import { Salario } from './Salario';
import LabeledInput from './components/LabeledInput';

export default class App extends Component {
  state = {

  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
};
