import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class Button extends PureComponent {
  loading = () => {
    const { isLoading } = this.props;
    if (isLoading) {
      return (
        <span
          className="spinner-border spinner-border-sm mr-2"
          role="status"
          aria-hidden="true"
        />
      );
    }
    return null;
  };

  isExtension = () =>
    ['extension', 'twitterextension', 'shareit'].includes(
      localStorage.getItem('createFrom'),
    );

  render() {
    const {
      bsClass,
      children,
      disabled,
      onClick,
      href,
      type,
      id,
      form,
      dataToggle,
      dataDismiss,
      ariaHidden,
      style,
      ariaHaspopup,
      ariaExpanded,
      name,
      ariaLabel,
      dataTest,
      key,
      dataSize,
      onMouseEnter,
      onMouseLeave,
      variant,
      isLoading,
      autofocus,
      innerRefBtn,
      noTabIndex,
      tabIdx,
    } = this.props;

    if (href) {
      let redirectLink = href;
      if (this.isExtension()) {
        const { pathname, search } = window.location;
        redirectLink = `${pathname}${search}`;
      }
      return (
        <Link
          to={redirectLink}
          className={bsClass}
          onClick={onClick}
          disabled={disabled}
          style={style}
        >
          {children}
        </Link>
      );
    }

    return (
      // eslint-disable-next-line react/button-has-type
      <button
        type={type}
        className={bsClass}
        disabled={disabled || isLoading}
        onClick={onClick}
        id={id || null}
        form={form || null}
        data-toggle={dataToggle}
        data-dismiss={dataDismiss}
        aria-hidden={ariaHidden}
        style={style}
        name={name}
        aria-label={ariaLabel}
        aria-haspopup={ariaHaspopup}
        aria-expanded={ariaExpanded}
        data-test={dataTest}
        key={key}
        data-size={dataSize}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        variant={variant}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        ref={innerRefBtn}
        {...(noTabIndex ? { tabIndex: '-1' } : {})}
        {...(tabIdx ? { tabIndex: tabIdx } : {})}
      >
        {this.loading()}
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  bsClass: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  autofocus: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  href: PropTypes.string,
  form: PropTypes.string,
  dataToggle: PropTypes.string,
  ariaHidden: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  dataDismiss: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object]),
  name: PropTypes.string,
  ariaExpanded: PropTypes.string,
  ariaHaspopup: PropTypes.string,
  ariaLabel: PropTypes.string,
  dataTest: PropTypes.string,
  dataSize: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  variant: PropTypes.string,
  key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isLoading: PropTypes.bool,
  innerRefBtn: PropTypes.shape({}),
  noTabIndex: PropTypes.bool,
  tabIdx: PropTypes.string,
};

Button.defaultProps = {
  bsClass: '',
  id: null,
  href: '',
  form: null,
  autofocus: false,
  type: 'button',
  children: null,
  disabled: false,
  dataToggle: null,
  dataDismiss: null,
  ariaHidden: null,
  style: {},
  name: null,
  dataTest: null,
  ariaExpanded: null,
  ariaHaspopup: null,
  ariaLabel: null,
  key: null,
  dataSize: null,
  variant: null,
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  isLoading: false,
  innerRefBtn: React.createRef(),
  noTabIndex: false,
  tabIdx: null,
};
