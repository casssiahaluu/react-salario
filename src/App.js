import React, {Component} from 'react';

import 'bulma';
import { interval } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { Salario } from './helpers/Salario';
import LabeledInput from './components/LabeledInput';

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
      <div className="columns is-mobile">
        <div className="column">
          <div className="columns">
            <div className="column is-full">
              <img alt="Logo React" src={logo} width="150px"/>
            </div>
            <div className="column">
              <h3>
                Cálculo de salário com React.js
              </h3>
            </div>
          </div>
          <div className="columns">
            <div className="column is-half">
              <div className="columns"><h3>Cálculo em tempo real</h3></div>
              <div className="columns">
                <LabeledInput
                  label="Salário bruto:"
                  customId="inputSalarioBruto"
                  value={this.state.salarioBruto}
                  onChange={(event) => this.updateSalario(event)}
                  />
              </div>
              <div className="columns">
                <LabeledInput
                  disabled
                  currency
                  label="Base INSS:"
                  value={this.state.salario.baseINSS}
                  />
              </div>
              <div className="columns">
                <LabeledInput
                  disabled
                  currency
                  label="Desconto INSS:"
                  value={this.state.salario.descontoINSS}
                  />
              </div>
              <div className="columns">
                <LabeledInput
                  disabled
                  currency
                  label="Base IRPF:"
                  value={this.state.salario.baseIRPF}
                  />
              </div>
              <div className="columns">
                <LabeledInput
                  disabled
                  currency
                  label="Desconto IRPF:"
                  value={this.state.salario.descontoIRPF}
                  />
              </div>
              <div className="columns">
                <LabeledInput
                  disabled
                  currency
                  label="Salário líquido:"
                  customId="inputSalarioLiquido"
                  value={this.state.salario.salarioLiquido}
                  />
              </div>
            </div>
            <div className="column">
              <h3>
                Cálculo reverso com Observables
              </h3>

              <LabeledInput
                value={this.state.salarioLiquidoDesejado}
                label="Salário líquido desejado:"
                customId="inputSalarioLiquidoDesejado"
                onChange={(event) => this.updateSalarioLiquidoDesejado(event)}
                />

              <button onClick={() => this.findSalarioBrutoFromLiquido()}>
                Calcular salário bruto correspondente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
