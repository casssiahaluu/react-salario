import React, {Component} from 'react';

import { interval } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import {
  Button,
  Col,
  Container,
  Jumbotron,
  Row
} from 'reactstrap';

import { Salario } from './helpers/Salario';
import LabeledInput from './components/LabeledInput';

import './App.css';

import logo from './logo.svg';

export default class App extends Component {
  state = {
    salarioBruto: 0,
    salario: new Salario(0),
    salarioLiquidoDesejado: 5000
  }

  _internalUpdateSalario(newSalario) {
    this.setState({
      salarioBruto: newSalario,
      salario: new Salario(+newSalario),
    });
  }

  updateSalario(event) {
    this._internalUpdateSalario(event.target.value);
  }

  updateSalarioLiquidoDesejado(event) {
    this.setState({salarioLiquidoDesejado: event.target.value});
  }

  findSalarioBrutoFromLiquido() {
    const inputSalarioBruto = document.getElementById('inputSalarioBruto');
    inputSalarioBruto.value = this.state.salarioLiquidoDesejado;

    const obs$ = interval(0.01).pipe(
    map(() => {
      const currentValue = + this.state.salario.salarioLiquido;
      const difference = Math.abs(currentValue - + this.salarioLiquidoDesejado);
      const increment = difference >= 1000 ? 500 : difference >= 100 ? 50 : 1;

      inputSalarioBruto.value = (+inputSalarioBruto.value + increment).toFixed(2);

      this._internalUpdateSalario(inputSalarioBruto.value);

      return this.state.salario.salarioLiquido;
    }),);
    const match$ = obs$.pipe(filter(currentValue => +currentValue >= this.state.salarioLiquidoDesejado),);
    obs$.pipe(takeUntil(match$)).subscribe();
  }

  render() {
    return (
      <Container className="App">
        <Row>
          <Col className="text-center">
            <h1>Calculadora de Salário Líquido em React.js <img src={logo} alt="React Logo" width="150px"/></h1>
          </Col>
        </Row>
        <Row>
          <Col className="calc">
            <Jumbotron>
              <Col><h3>Cálculo em tempo real</h3></Col>
              <Col>
                <LabeledInput
                  label="Salário bruto:"
                  customId="inputSalarioBruto"
                  value={this.state.salarioBruto}
                  onChange={(event) => this.updateSalario(event)}
                  />
              </Col>
              <Col>
                <LabeledInput
                  disabled
                  currency
                  label="Base INSS:"
                  value={this.state.salario.baseINSS}
                  />
              </Col>
              <Col>
                <LabeledInput
                  disabled
                  currency
                  label="Desconto INSS:"
                  value={this.state.salario.descontoINSS}
                  />
              </Col>
              <Col>
                <LabeledInput
                  disabled
                  currency
                  label="Base IRPF:"
                  value={this.state.salario.baseIRPF}
                  />
              </Col>
              <Col>
                <LabeledInput
                  disabled
                  currency
                  label="Desconto IRPF:"
                  value={this.state.salario.descontoIRPF}
                  />
              </Col>
              <Col>
                <LabeledInput
                  disabled
                  currency
                  label="Salário líquido:"
                  customId="inputSalarioLiquido"
                  value={this.state.salario.salarioLiquido}
                  />
              </Col>
            </Jumbotron>
          </Col>
          <Col className="calc-reverse">
            <Jumbotron>
              <h3>Cálculo reverso com Observables</h3>
              <Col sm={12}>
                <LabeledInput
                  value={this.state.salarioLiquidoDesejado}
                  label="Salário líquido desejado:"
                  customId="inputSalarioLiquidoDesejado"
                  onChange={(event) => this.updateSalarioLiquidoDesejado(event)}
                />
              </Col>
              <Col sm={{ size: 10, offset: 4 }}>
                <Button outline color="primary" onClick={() => this.findSalarioBrutoFromLiquido()}>Calcular salário bruto correspondente</Button>
              </Col>
            </Jumbotron>
          </Col>
        </Row>
      </Container>
    )
  }
};
