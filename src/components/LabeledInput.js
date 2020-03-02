import React from 'react';

/**
 * Uma boa prática para criar componentes é
 * utilizar PropTypes. Isso facilita o trabalho
 * do desenvolvedor que irá utilizar o componente.
 *
 * O VSCode, por exemplo, utiliza as PropTypes para
 * mostrar ao desenvolvedor quais props ele pode
 * utilizar com o componente, por exemplo.
 *
 */
import PropTypes from 'prop-types';

/**
 * O componente TextField faz parte do package Material UI,
 * que leva o Material Design do Google ao React.
 */

const formatValue = (currency, value) => {
  if (!currency) return value;

  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const LabeledInput = ({
  currency,
  disabled,
  customId,
  label,
  value,
  onInputChange,
}) => (
  <label>
    <span>{ label }</span>
    <input
      id={ customId }
      disabled={disabled}
      type={!!currency ? 'text' : 'number'}
      value={() => formatValue(currency, value)}
      onChange={event => !!onInputChange && onInputChange(event)}
      min={0}
    />
  </label>
);

/**
 * Aqui definimos valores
 * default para cada prop
 */

LabeledInput.defaultProps = {
  currency: false,
  disabled: false
};

/**
 * Aqui definimos os tipos
 * de cada prop.
 */

LabeledInput.propTypes = {
  currency: PropTypes.bool,
  disabled: PropTypes.bool,
  customId: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onInputChange: PropTypes.func.isRequired
};

export default LabeledInput;
