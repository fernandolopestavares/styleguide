import React, { Component } from 'react'
import PropTypes from 'prop-types'

import NumberFormat from 'react-number-format'

import Input from '../Input'

import withForwardedRef from '../../modules/withForwardedRef'

/** WORKAROUND incoming!
 * BaseInput is a wrapper for the Input component for being able to use the
 * prefix prop with the NumberFormat component.
 * We can remove this as soon as the following issue is resolved:
 * https://github.com/s-yadav/react-number-format/issues/276
 *
 */
const BaseInput = props => {
  const { inputPrefix: prefix, inputSuffix: suffix } = props
  return <Input {...props} prefix={prefix} suffix={suffix} />
}

BaseInput.propTypes = {
  inputPrefix: PropTypes.string,
  inputSuffix: PropTypes.string,
}

const baseNumber = 9999999999.9999999999

class InputCurrency extends Component {
  handleChange = ({ floatValue }) => {
    this.props.onChange &&
      this.props.onChange({
        ...event,
        target: {
          ...event.target,
          value: floatValue,
        },
      })
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { locale, currencyCode, onChange, ...props } = this.props

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    })

    const formattedParts = formatter.formatToParts
      ? formatter.formatToParts(baseNumber)
      : null
    const prefix = formattedParts
      ? !formattedParts.map(part => part.type).indexOf('currency')
      : true
    const [currencySymbol] = formattedParts
      ? formattedParts
          .filter(part => part.type === 'currency')
          .map(part => part.value)
      : ['$']
    const [decimalSeparator] = formattedParts
      ? formattedParts
          .filter(part => part.type === 'decimal')
          .map(part => part.value)
      : ['.']
    const [thousandSeparator] = formattedParts
      ? formattedParts
          .filter(part => part.type === 'group')
          .map(part => part.value)
      : [',']
    const [fraction] = formattedParts
      ? formattedParts
          .filter(part => part.type === 'fraction')
          .map(part => part.value)
      : ['99']

    return (
      <div>
        <NumberFormat
          {...props}
          inputPrefix={prefix ? currencySymbol : null}
          inputSuffix={prefix ? null : currencySymbol}
          decimalSeparator={decimalSeparator || false}
          decimalScale={fraction ? fraction.length : 0}
          fixedDecimalScale={!!decimalSeparator}
          thousandSeparator={thousandSeparator}
          onValueChange={this.handleChange}
          customInput={BaseInput}
        />
      </div>
    )
  }
}

InputCurrency.propTypes = {
  /** @ignore Forwarded Ref */
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.element }),
  ]),
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  size: PropTypes.string,
  defaultValue: PropTypes.number,
  value: PropTypes.number,
  /** Locale ISO string ('en-US', 'pt-BR', etc.)*/
  locale: PropTypes.string.isRequired,
  /** Currency code in ISO 4217 ('USD', 'BRL', etc.) */
  currencyCode: PropTypes.string.isRequired,
}

export default withForwardedRef(InputCurrency)
