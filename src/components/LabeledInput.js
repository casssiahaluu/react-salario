import React from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from 'reactstrap';

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
  onChange,
}) => (
  <Form>
    <FormGroup row>
      <Label for={ customId } sm={5}>{ label }</Label>
      <Col sm={7}>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            {!disabled && <InputGroupText>$</InputGroupText>}
          </InputGroupAddon>
          <Input
            min={0}
            id={ customId }
            name={ customId }
            disabled={ disabled }
            type={!!currency ? 'text' : 'number'}
            value={formatValue(currency, value)}
            onChange={event => !!onChange && onChange(event)}
          />
        </InputGroup>
      </Col>
    </FormGroup>
  </Form>
);

LabeledInput.defaultProps = {
  currency: false,
  disabled: false
};

LabeledInput.propTypes = {
  currency: PropTypes.bool,
  disabled: PropTypes.bool,
  customId: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func
};

export default LabeledInput;
