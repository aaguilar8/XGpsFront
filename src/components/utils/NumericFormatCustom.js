import React from "react";
import { NumericFormat } from 'react-number-format';
import PropTypes from 'prop-types';

export const NumericFormatCustom = React.forwardRef(
    function NumericFormatCustom(props, ref) {
      const { onChange,decimalScale, ...other } = props;
  
      return (
        <NumericFormat
          {...other}
          getInputRef={ref}
          onValueChange={(values) => {
            onChange({
              target: {
                name: props.name,
                value: values.value,
              },
            });
          }}
          thousandSeparator
          valueIsNumericString
          decimalScale={decimalScale}
          fixedDecimalScale 
          // prefix="$"
          allowedDecimalSeparators={['%']}
        />
      );
    },
  );
  
  NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    decimalScale: PropTypes.number.isRequired
  };