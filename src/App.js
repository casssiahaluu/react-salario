import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {interval, timer, Observable} from 'rxjs';
import {takeUntil, map, filter} from 'rxjs/operators';

import {Salario} from './Salario';
import LabeledInput from './components/LabeledInput';

export default class App extends Component {
  state = {
    salarioBruto: 0,
    salario: new Salario(0),
    salarioLiquidoDesejado: '5000'
  }

  _internalUpdateSalario(newSalario) {
    this.setState({
      salarioBruto: newSalario,
      salario: new Salario(+newSalario),
    });
  }

  updateSalario(event) {
    this._internalUpdateSalario(+event.target.value);
  }

  updateSalarioLiquidoDesejado(event) {
    this.setState({salarioLiquidoDesejado: event.target.value});
  }

  findSalarioBrutoFromLiquido() {
    /**
     * Obtendo o input que define o salário bruto
     * e atualizando-o com o salário líquido desejado,
     * evitando iterações desnecessárias.
     *
     * $el é uma variável especial do Vue que aponta
     * para o elemento monitorado pelo Vue. Na maioria
     * dos casos, é uma div com id #app (verifique index.html).
     * Com $el, conseguimos "navegar" dentro dos filhos do
     * elemento (children), obtendo referências com querySelector,
     * por exemplo.
     */
    const inputSalarioBruto = this.$el.querySelector('#inputSalarioBruto');
    inputSalarioBruto.value = this.salarioLiquidoDesejado;

    /**
     * Obtendo referência ao input de salário líquido atual
     */
    const inputSalarioLiquido = this.$el.querySelector('#inputSalarioLiquido');

    /**
     * Criando observable que, a cada 1 milisegundo, incrementa
     * o salário bruto e o recalcula no estado da aplicação. Por
     * fim, retorna o salarioLiquido obtido após o cálculo.
     *
     */
    const obs$ = interval(1).pipe(
    /**
       * Transformação de dados (map)
       */
    map(() => {
      /**
         * Obtendo o salário líquido do momento
         */
      const currentValue = + this.salario.salarioLiquido;

      /**
         * Calculando a diferença entre o salário líquido do momento
         * e o salário líquido desejado
         */
      const difference = Math.abs(currentValue - + this.salarioLiquidoDesejado);

      /**
         * Quando a diferença for menor que 5 reais, o
         * incremento passa a ser de 1 centavo (0.01)
         * para uma melhor precisão no cálculo sem que
         * o mesmo se torne lento, ou seja, enquanto a
         * diferença for maior que 5 reais o incremento
         * é de "1 em 1 real"
         */
      const increment = difference >= 5
        ? 1
        : 0.01;

      /**
         * Incrementando o valor no salário bruto
         * e formatando para 2 casas decimais
         */
      inputSalarioBruto.value = (+ inputSalarioBruto.value + increment).toFixed(2);

      /**
         * Atualizando o salário bruto. Quando atualizamos o valor
         * "na mão", o Vue não consegue monitorar as
         * mudanças
         */
      this._internalUpdateSalario(inputSalarioBruto.value);

      /**
         * Por fim, retornamos o salário líquido atual
         */
      return this.salario.salarioLiquido;
    }),);

    /**
     * Observable para ser utilizado com takeUntil,
     * que será a condição de término da execução
     * (salarioLiquido do estado maior ou igual ao salarioLiquido desejado)
     */
    const match$ = obs$.pipe(filter(currentValue => + currentValue >= + this.salarioLiquidoDesejado),);

    /**
     * Acionamos, por fim, a execução do observable com
     * subscribe()
     */
    obs$.pipe(takeUntil(match$)).subscribe();
  }

  render() {
    return (<div className="App">
      <div className="row">
        <img alt="Logo React" src={logo} width="50px"/>
        <h3>
          Cálculo de salário com React.js
        </h3>
      </div>
      <br/>
      <br/>

      <div className="content">
        <div className="mainContent">
          <h3>Cálculo em tempo real</h3>

          <LabeledInput
            label="Salário bruto:"
            customId="inputSalarioBruto"
            value={this.state.salarioBruto}
            onChange={(event) => this.updateSalario(event)}
          />

          <LabeledInput
            disabled
            currency
            label="Base INSS:"
            value={this.state.salario.baseINSS}
          />

          <LabeledInput
            disabled
            currency
            label="Desconto INSS:"
            value={this.state.salario.descontoINSS}
          />

          <LabeledInput
            disabled
            currency
            label="Base IRPF:"
            value={this.state.salario.baseIRPF}
          />

          <LabeledInput
            disabled
            currency
            label="Desconto IRPF:"
            value={this.state.salario.descontoIRPF}
          />

          <LabeledInput
            disabled
            currency
            label="Salário líquido:"
            customId="inputSalarioLiquido"
            value={this.state.salario.salarioLiquido}
          />
        </div>

        <div className="sideContent">
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
    </div>)
  }
};
