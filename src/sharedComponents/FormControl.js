import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FormControl extends PureComponent {
    render() {
        const {
            placeholder,
            type,
            onChange,
            value,
            bsClass,
            id,
            onEnterKeyPress,
            onKeyDown,
            disabled,
            hasError,
            maxLength,
            autoFocus,
            handleOnFocus,
            inputRef,
        } = this.props;
        return (
            <input
                disabled={disabled}
                placeholder={placeholder}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={autoFocus}
                type={type}
                id={id}
                className={`form-control ${bsClass || ''} ${
                    hasError && 'is-invalid'
                }`}
                value={value}
                maxLength={maxLength}
                onChange={onChange}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        onEnterKeyPress(event);
                    }
                }}
                onKeyDown={onKeyDown}
                onFocus={handleOnFocus}
                ref={inputRef}
            />
        );
    }
}

FormControl.propTypes = {
    bsClass: PropTypes.string,
    id: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onEnterKeyPress: PropTypes.func,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    hasError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    maxLength: PropTypes.number,
    autoFocus: PropTypes.bool.isRequired,
    handleOnFocus: PropTypes.func,
    inputRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.object }),
    ]),
};
FormControl.defaultProps = {
    bsClass: '',
    id: '',
    onChange: () => {},
    disabled: false,
    maxLength: null,
    onEnterKeyPress: () => {},
    onKeyDown: () => {},
    placeholder: '',
    type: '',
    value: '',
    hasError: '',
    handleOnFocus: () => {},
    inputRef: { current: '' },
};

export default React.forwardRef((props, ref) => (
    <FormControl inputRef={ref} {...props} />
));
