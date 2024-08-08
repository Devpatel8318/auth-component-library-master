import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';

function HelloWorld() {
  return /*#__PURE__*/React.createElement("h1", {
    className: "mfa-password-error"
  }, "Hello World 1234");
}

function QRScreen(_ref) {
  let {
    next,
    userEmail,
    Button,
    generateMfaQrLink
  } = _ref;
  const [qrLink, setQRLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getQrLink = async () => {
      setIsLoading(true);
      const qrLinkResponse = await generateMfaQrLink('SocialPilot', userEmail);
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

const OtpVerification = _ref => {
  let {
    length = 6,
    primaryText,
    secondaryText,
    Icon,
    secondaryButtonText,
    goBack,
    primaryButtonText,
    verifyOtp,
    successMessage,
    codeInvalidMessage,
    onComplete,
    isOtpVerified,
    setIsOtpVerified,
    showResendOption,
    resendOtp,
    Button,
    SpinnerSmallLoader
  } = _ref;
  const [OTP, setOTP] = useState(Array(length).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = async code => {
    setIsLoading(true);
    setErrorMessage('');
    const verificationCodeResponse = await verifyOtp(code);
    setIsLoading(false);
    if (verificationCodeResponse.error) {
      setErrorMessage(codeInvalidMessage);
      setOTP(Array(length).fill(''));
      return false;
    }
    setIsOtpVerified(true);
    return true;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 text-center mt-2 mfa-qr-container p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row flex-column justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 mb-2"
  }, Icon), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 mb-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mfa-otp-text mb-8"
  }, primaryText), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-grey"
  }, secondaryText)), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 mb-1 position-relative"
  }, /*#__PURE__*/React.createElement(OtpInput, {
    length: length,
    OTP: OTP,
    setOTP: setOTP,
    isLoading: isLoading,
    setIsLoading: setIsLoading,
    errorMessage: errorMessage,
    setErrorMessage: setErrorMessage,
    handleSubmit: handleSubmit
  }), isLoading && /*#__PURE__*/React.createElement("div", {
    className: "mt-8 mfa-otp-spinner-loader"
  }, /*#__PURE__*/React.createElement(SpinnerSmallLoader, {
    className: "circular-spinner mr-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12"
  }, errorMessage && /*#__PURE__*/React.createElement("div", {
    className: "text-danger mfa-otp-message-text"
  }, errorMessage, ' ', showResendOption ? /*#__PURE__*/React.createElement("a", {
    className: "delete-group",
    href: "javascript:;",
    onClick: resendOtp
  }, "Resend code") : ''), !isLoading && !errorMessage && OTP.every(digit => digit !== '') && /*#__PURE__*/React.createElement("div", {
    className: "text-success mfa-otp-message-text"
  }, successMessage))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement("a", {
    className: "",
    href: "javascript:;",
    onClick: goBack
  }, secondaryButtonText), /*#__PURE__*/React.createElement(Button, {
    bsClass: "btn btn-primary btn-medium ml-2",
    disabled: !isOtpVerified,
    variant: "primary",
    onClick: onComplete
  }, primaryButtonText))))));
};

const mfaRecoveryEmailValidator = function (email, loginEmail) {
  let allowEmptyString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let emailTester = arguments.length > 3 ? arguments[3] : undefined;
  let DisplayText = arguments.length > 4 ? arguments[4] : undefined;
  let getLocalizeText = arguments.length > 5 ? arguments[5] : undefined;
  if (!email || !email.trim()) {
    return allowEmptyString ? '' : getLocalizeText(DisplayText.RECOVERY_EMAIL_MANDATORY);
  }
  if (!emailTester(email)) return getLocalizeText(DisplayText.NOT_VALID_EMAIL);
  if (email === loginEmail) {
    return 'Recovery email cannot be same as login e-mail.';
  }
  return '';
};

const RecoveryEmail = _ref => {
  let {
    userEmail,
    skip,
    onComplete,
    isOwner,
    Button,
    FormControl,
    emailTester,
    DisplayText,
    getLocalizeTest
  } = _ref;
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryEmailError, setRecoveryEmailError] = useState('');
  const recoveryEmailInputRef = useRef(null);
  const handleRecoveryEmailChange = e => {
    setRecoveryEmailError('');
    if (!e.target.value) {
      return;
    }
    setRecoveryEmail(e.target.value.trim());
  };
  useEffect(() => {
    if (!recoveryEmail) return setRecoveryEmailError('');
    const error = mfaRecoveryEmailValidator(recoveryEmail, userEmail, false, emailTester, DisplayText, getLocalizeTest);
    if (error) {
      setRecoveryEmailError(error);
    }
  }, [recoveryEmail]);
  useEffect(() => {
    if (recoveryEmailInputRef.current) {
      recoveryEmailInputRef.current.focus();
    }
  }, []);
  const isBtnDisabled = !recoveryEmail.length || recoveryEmail.length && recoveryEmailError;
  return /*#__PURE__*/React.createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col text-center mt-2 mfa-recovery-container p-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mfa-qr-text"
  }, "Add Recovery e-mail"), /*#__PURE__*/React.createElement("h5", {
    className: "mfa-recovery-text-secondary mb-2"
  }, "If you lose access to your authenticator you can use this e-mail as backup for login. Recovery e-mail and login e-mail cannot be the same."), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement(FormControl, {
    type: "email",
    id: "mfa-recovery-email",
    ref: recoveryEmailInputRef,
    hasError: recoveryEmailError,
    labelText: 'recoveryEmail',
    errorMessage: recoveryEmailError,
    name: "recoveryEmail",
    value: recoveryEmail,
    onChange: handleRecoveryEmailChange,
    bsClass: `text-center mfa-password-input-box`
  }), /*#__PURE__*/React.createElement("div", {
    className: `invalid-feedback ${recoveryEmailError ? 'd-block' : ''}`
  }, recoveryEmailError)))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col d-flex justify-content-end"
  }, !isOwner && /*#__PURE__*/React.createElement("a", {
    className: "delete-group btn-medium",
    href: "javascript:;",
    onClick: skip
  }, "Skip"), /*#__PURE__*/React.createElement(Button, {
    bsClass: "btn btn-primary btn-medium",
    disabled: !!isBtnDisabled,
    variant: "primary",
    onClick: () => onComplete(recoveryEmail)
  }, "Verify")))));
};

export { HelloWorld, OtpInput, OtpVerification, QRScreen, RecoveryEmail };
