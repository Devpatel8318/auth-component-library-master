import React, { PureComponent, useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';

function HelloWorld() {
  return /*#__PURE__*/React.createElement("h1", {
    className: "mfa-password-error"
  }, "Hello World 1234");
}

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

class Button extends PureComponent {
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
      tabIdx
    } = this.props;
    if (href) {
      let redirectLink = href;
      if (this.isExtension()) {
        const {
          pathname,
          search
        } = window.location;
        redirectLink = `${pathname}${search}`;
      }
      return /*#__PURE__*/React.createElement("div", {
        to: redirectLink,
        className: bsClass,
        onClick: onClick,
        disabled: disabled,
        style: style
      }, children);
    }
    return (
      /*#__PURE__*/
      // eslint-disable-next-line react/button-has-type
      React.createElement("button", _extends({
        type: type,
        className: bsClass,
        disabled: disabled || isLoading,
        onClick: onClick,
        id: id || null,
        form: form || null,
        "data-toggle": dataToggle,
        "data-dismiss": dataDismiss,
        "aria-hidden": ariaHidden,
        style: style,
        name: name,
        "aria-label": ariaLabel,
        "aria-haspopup": ariaHaspopup,
        "aria-expanded": ariaExpanded,
        "data-test": dataTest,
        key: key,
        "data-size": dataSize,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        variant: variant
        // eslint-disable-next-line jsx-a11y/no-autofocus
        ,
        autoFocus: autofocus,
        ref: innerRefBtn
      }, noTabIndex ? {
        tabIndex: '-1'
      } : {}, tabIdx ? {
        tabIndex: tabIdx
      } : {}), children)
    );
  }
}

function QRScreen(_ref) {
  let {
    next,
    userEmail
  } = _ref;
  const [qrLink, setQRLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getQrLink = async () => {
      setIsLoading(true);
      // const qrLinkResponse = await generateMfaQrLink(
      //     'SocialPilot',
      //     userEmail
      // );
      const qrLinkResponse = {
        qrLink: 'https://www.geeksforgeeks.org/how-to-generate-qr-code-using-react-qr-code-in-reactjs/'
      };
      if (!qrLinkResponse.error) {
        const {
          qrLink
        } = qrLinkResponse;
        setQRLink(qrLink);
      }
      setIsLoading(false);
    };
    getQrLink();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 text-center mt-2 mfa-qr-container p-0"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "qr-code-loader"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement(QRCode, {
    size: 200,
    value: qrLink
  })), /*#__PURE__*/React.createElement("h3", {
    className: "mfa-qr-text mt-0 mb-8"
  }, "Scan using authenticator to link SocialPilot"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-grey"
  }, "Use Google authenticator, Microsoft authenticator, Authy or Duo mobile", /*#__PURE__*/React.createElement("a", {
    href: "https://help.socialpilot.co/article/438-why-am-i-being-asked-to-re-connect-my-accounts#Account-disconnection-due-to-Missing-Roles-andor-Permissions-on-Faceb-VNHYK",
    target: "_blank",
    rel: "noopener noreferrer"
  }, ' ', "Learn more.")))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    bsClass: `btn btn-primary btn-medium`,
    disabled: false,
    variant: "primary",
    onClick: next
  }, "Next")))));
}

const OtpInput = _ref => {
  let {
    length,
    OTP,
    setOTP,
    isLoading,
    errorMessage,
    setErrorMessage,
    handleSubmit
  } = _ref;
  const inputRef = useRef(Array(length).fill(null));
  const [lastInputIndex, setLastInputIndex] = useState(null);
  const handleTextChange = async (input, index) => {
    if (!/^\d*$/.test(input)) return; // only numeric input

    const newOtp = [...OTP];
    newOtp[index] = input;
    setOTP(newOtp);
    if (input && index < length - 1) {
      if (inputRef.current[index + 1]) {
        inputRef.current[index + 1].focus();
      }
    }
    if (newOtp.every(digit => digit !== '')) {
      setLastInputIndex(index);
      const submitResponse = await handleSubmit(newOtp.join(''));
      if (!submitResponse) {
        setLastInputIndex(0);
      }
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      setErrorMessage('');
      if (OTP[index] === '' && index > 0) {
        if (inputRef.current[index - 1]) {
          inputRef.current[index - 1].focus();
        }
      } else {
        const newPin = [...OTP];
        newPin[index] = '';
        setOTP(newPin);
      }
    }
  };
  const handlePaste = e => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length).split('');
    const newOTP = [...OTP];
    pasteData.forEach((char, index) => {
      if (/^\d$/.test(char)) {
        newOTP[index] = char;
      }
    });
    setOTP(newOTP);
    if (newOTP.every(digit => digit !== '')) {
      handleSubmit(newOTP.join(''));
    }
  };
  useEffect(() => {
    if (!isLoading && lastInputIndex !== null && inputRef.current[lastInputIndex]) {
      inputRef.current[lastInputIndex].focus();
    }
  }, [isLoading, lastInputIndex]);
  useEffect(() => {
    inputRef.current[0].focus();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-start w-100",
    onPaste: handlePaste
  }, Array.from({
    length
  }, (_, index) => /*#__PURE__*/React.createElement("input", {
    key: index,
    type: "text",
    maxLength: 1,
    value: OTP[index],
    disabled: isLoading,
    onChange: e => handleTextChange(e.target.value, index),
    onKeyDown: e => handleKeyDown(e, index),
    ref: ref => {
      inputRef.current[index] = ref;
    },
    className: `mfa-otp-input ${errorMessage ? 'mfa-otp-input-invalid' : ''}`
  })));
};

export { HelloWorld, OtpInput, QRScreen };
