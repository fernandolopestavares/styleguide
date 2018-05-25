import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import BoldCheckIcon from '../icon/BoldCheck'

class Checkbox extends PureComponent {
  handleChange = e => !this.props.disabled && this.props.onChange(e)

  render() {
    const {
      checked,
      disabled,
      id,
      label,
      name,
      required,
      value,
    } = this.props

    return (
      <div
        className={classNames('flex items-center mb3 relative', {
          pointer: !disabled,
        })}
      >
        <div
          className={classNames(
            'h1 w1 relative ba bw1 br1 mr3 flex justify-center items-center',
            {
              'b--light-gray pointer': !checked && !disabled,
              'b--light-gray bg-light-silver': !checked && disabled,
              'b--blue bg-blue': checked && !disabled,
              'b--silver bg-silver': checked && disabled,
            },
          )}
        >
        </div>
        {checked &&
          <div
            className="absolute flex o-100 left-0"
          >
            <BoldCheckIcon size={16} color={disabled ? 'gray' : 'white'} />
          </div>
        }
        <input
          checked={checked}
          className={classNames('h1 w1 absolute o-0', {
            pointer: !disabled,
          })}
          disabled={disabled}
          required={required}
          id={id}
          name={name}
          onChange={this.handleChange}
          type="checkbox"
          value={value}
        />
        <label
          className={classNames('near-black', { gray: disabled }, { pointer: !disabled })}
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    )
  }
}

Checkbox.defaultProps = {
  checked: false,
  disabled: false,
  required: false,
}

Checkbox.propTypes = {
  /** (Input spec attribute) */
  checked: PropTypes.bool,
  /** (Input spec attribute) */
  disabled: PropTypes.bool,
  /** (Input spec attribute) */
  id: PropTypes.string,
  /** Checkbox label */
  label: PropTypes.string.isRequired,
  /** (Input spec attribute) */
  name: PropTypes.string.isRequired,
  /** onChange event */
  onChange: PropTypes.func.isRequired,
  /** (Input spec attribute) */
  required: PropTypes.bool,
  /** (Input spec attribute) */
  value: PropTypes.string.isRequired,
}

export default Checkbox
