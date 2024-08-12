import React, { useRef, useState, useEffect, PureComponent } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';

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
OtpInput.propTypes = {
  length: PropTypes.number.isRequired,
  OTP: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOTP: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

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
      inputRef
    } = this.props;
    return /*#__PURE__*/React.createElement("input", {
      disabled: disabled,
      placeholder: placeholder
      // eslint-disable-next-line jsx-a11y/no-autofocus
      ,
      autoFocus: autoFocus,
      type: type,
      id: id,
      className: `form-control ${bsClass || ''} ${hasError && 'is-invalid'}`,
      value: value,
      maxLength: maxLength,
      onChange: onChange,
      onKeyPress: event => {
        if (event.key === 'Enter') {
          onEnterKeyPress(event);
        }
      },
      onKeyDown: onKeyDown,
      onFocus: handleOnFocus,
      ref: inputRef
    });
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
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.object
  })])
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
  inputRef: {
    current: ''
  }
};
var FormControl$1 = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(FormControl, _extends({
  inputRef: ref
}, props)));

const ConfirmPasswordModal = _ref => {
  let {
    onCloseModal,
    onPasswordConfirm,
    userEmail,
    SPModal,
    Button,
    cognitoSignIn,
    SpinnerSmallLoader,
    FormControl,
    labels,
    primaryText
  } = _ref;
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const passwordInputRef = useRef(null);
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);
  const handlePasswordChange = e => {
    setPasswordError('');
    setPassword(e.target.value);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError('');
    const {
      success,
      error
    } = await cognitoSignIn(userEmail, password, 1, true);
    setIsLoading(false);
    if (error) {
      setPasswordError(error);
    }
    if (success) {
      onPasswordConfirm();
    }
  };
  const {
    CONFIRM_PASSWORD,
    CONFIRM
  } = labels;
  return /*#__PURE__*/React.createElement(SPModal, {
    showModal: true,
    onCloseModal: onCloseModal,
    closeOnOverlayClick: false,
    closeIcon: true,
    closeOnEsc: true,
    title: CONFIRM_PASSWORD,
    classNames: {
      modal: 'popup-bg mfa-password-modal'
    },
    styles: {
      modal: {
        width: '442px'
      }
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-40"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "mfa-password-text mb-8 text-grey mt-0"
  }, primaryText), /*#__PURE__*/React.createElement("h3", {
    className: "mfa-password-email mb-2 mt-0"
  }, userEmail), /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-0 position-relative"
  }, /*#__PURE__*/React.createElement(FormControl, {
    type: "password",
    id: "mfa-confirm-password",
    ref: passwordInputRef,
    hasError: passwordError,
    errorMessage: passwordError,
    name: "confirmPassword",
    value: password,
    onChange: handlePasswordChange,
    bsClass: `text-center mfa-password-input-box`
  }), /*#__PURE__*/React.createElement("div", {
    className: `invalid-feedback ${passwordError ? 'd-block' : ''}`
  }, passwordError), isLoading && /*#__PURE__*/React.createElement("div", {
    className: "mt-1 input-spinner-loader"
  }, /*#__PURE__*/React.createElement(SpinnerSmallLoader, {
    className: "circular-spinner mr-8"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    bsClass: "btn btn-primary btn-medium",
    disabled: isLoading,
    variant: "primary",
    type: "submit"
  }, CONFIRM))))));
};
ConfirmPasswordModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onPasswordConfirm: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  SPModal: PropTypes.elementType.isRequired,
  Button: PropTypes.elementType.isRequired,
  cognitoSignIn: PropTypes.func.isRequired,
  SpinnerSmallLoader: PropTypes.elementType.isRequired,
  FormControl: PropTypes.elementType,
  labels: PropTypes.shape({
    CONFIRM_PASSWORD: PropTypes.string.isRequired,
    CONFIRM: PropTypes.string.isRequired,
    PLEASE_CONFIRM_PASSWORD_ENABLE_2FA: PropTypes.string.isRequired
  }).isRequired
};
ConfirmPasswordModal.defaultProps = {
  FormControl: FormControl$1
};

const emailTester = email => {
  // eslint-disable-next-line no-useless-escape
  const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!email) return false;
  if (email.length > 254) return false;
  if (!tester.test(email)) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  if (parts[0].length > 64) return false;
  return true;
};
const mfaRecoveryEmailValidator = function (email, loginEmail) {
  let allowEmptyString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let RECOVERY_EMAIL_MANDATORY = arguments.length > 3 ? arguments[3] : undefined;
  let NOT_VALID_EMAIL = arguments.length > 4 ? arguments[4] : undefined;
  if (!email || !email.trim()) {
    return allowEmptyString ? '' : RECOVERY_EMAIL_MANDATORY;
  }
  if (!emailTester(email)) return NOT_VALID_EMAIL;
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
    isRecoveryEmailMandatory,
    Button,
    FormControl,
    ADD_RECOVERY_EMAIL,
    LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP,
    SKIP,
    VERIFY,
    RECOVERY_EMAIL_MANDATORY,
    NOT_VALID_EMAIL
  } = _ref;
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryEmailError, setRecoveryEmailError] = useState('');
  const recoveryEmailInputRef = useRef(null);
  const handleRecoveryEmailChange = e => {
    setRecoveryEmailError('');
    setRecoveryEmail(e.target.value.trim());
  };
  useEffect(() => {
    if (!recoveryEmail) return setRecoveryEmailError('');
    const error = mfaRecoveryEmailValidator(recoveryEmail, userEmail, false, RECOVERY_EMAIL_MANDATORY, NOT_VALID_EMAIL);
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
  }, ADD_RECOVERY_EMAIL), /*#__PURE__*/React.createElement("h5", {
    className: "mfa-recovery-text-secondary mb-2"
  }, LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement(FormControl, {
    type: "email",
    id: "mfa-recovery-email",
    ref: recoveryEmailInputRef,
    hasError: recoveryEmailError,
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
  }, !isRecoveryEmailMandatory && /*#__PURE__*/React.createElement("a", {
    className: "delete-group btn-medium",
    href: "javascript:;",
    onClick: skip
  }, SKIP), /*#__PURE__*/React.createElement(Button, {
    bsClass: "btn btn-primary btn-medium",
    disabled: !!isBtnDisabled,
    variant: "primary",
    onClick: () => onComplete(recoveryEmail)
  }, VERIFY)))));
};
RecoveryEmail.propTypes = {
  userEmail: PropTypes.string.isRequired,
  skip: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  isRecoveryEmailMandatory: PropTypes.bool.isRequired,
  Button: PropTypes.elementType.isRequired,
  FormControl: PropTypes.elementType.isRequired,
  ADD_RECOVERY_EMAIL: PropTypes.string.isRequired,
  LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: PropTypes.string.isRequired,
  SKIP: PropTypes.string.isRequired,
  VERIFY: PropTypes.string.isRequired,
  RECOVERY_EMAIL_MANDATORY: PropTypes.string.isRequired,
  NOT_VALID_EMAIL: PropTypes.string.isRequired
};

function QRScreen(_ref) {
  let {
    next,
    userEmail,
    Button,
    generateMfaQrLink,
    SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP,
    USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR,
    LEARN_MORE,
    NEXT
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
  }, [userEmail, generateMfaQrLink]);
  return /*#__PURE__*/React.createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 text-center mt-2 mfa-qr-container p-0"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "qr-code-loader mb-8"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement(QRCode, {
    size: 200,
    value: qrLink
  })), /*#__PURE__*/React.createElement("h3", {
    className: "mfa-qr-text mt-0 mb-8"
  }, SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-grey"
  }, USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR, /*#__PURE__*/React.createElement("a", {
    href: "https://help.socialpilot.co/article/438-why-am-i-being-asked-to-re-connect-my-accounts#Account-disconnection-due-to-Missing-Roles-andor-Permissions-on-Faceb-VNHYK",
    target: "_blank",
    rel: "noopener noreferrer"
  }, ' ', LEARN_MORE)))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    bsClass: `btn btn-primary btn-medium`,
    disabled: false,
    variant: "primary",
    onClick: next
  }, NEXT)))));
}
QRScreen.propTypes = {
  next: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  Button: PropTypes.elementType.isRequired,
  generateMfaQrLink: PropTypes.func.isRequired,
  SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP: PropTypes.string.isRequired,
  USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR: PropTypes.string.isRequired,
  LEARN_MORE: PropTypes.string.isRequired,
  NEXT: PropTypes.string.isRequired
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
    SpinnerSmallLoader,
    RESEND_CODE
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
  }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
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
  }, RESEND_CODE) : ''), !isLoading && !errorMessage && OTP.every(digit => digit !== '') && /*#__PURE__*/React.createElement("div", {
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
OtpVerification.propTypes = {
  length: PropTypes.number,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
  Icon: PropTypes.node,
  secondaryButtonText: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  verifyOtp: PropTypes.func.isRequired,
  successMessage: PropTypes.string.isRequired,
  codeInvalidMessage: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  isOtpVerified: PropTypes.bool.isRequired,
  setIsOtpVerified: PropTypes.func.isRequired,
  showResendOption: PropTypes.bool.isRequired,
  resendOtp: PropTypes.func.isRequired,
  Button: PropTypes.elementType.isRequired,
  SpinnerSmallLoader: PropTypes.elementType.isRequired,
  RESEND_CODE: PropTypes.string.isRequired
};

const emailOtpLock = () => /*#__PURE__*/React.createElement("svg", {
  width: "100",
  height: "100",
  viewBox: "0 0 100 100",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("path", {
  d: "M50 50.4819L83.3333 28.6861L82.051 25.0007L50 45.834L17.949 25.0007L16.6667 28.6861L50 50.4819ZM77.0833 79.1673C76.0389 79.1673 75.1635 78.8142 74.4573 78.1079C73.751 77.401 73.3979 76.5257 73.3979 75.4819V62.9819C73.3979 61.9076 73.8104 61.0246 74.6354 60.3329C75.4604 59.6413 76.4368 59.2954 77.5646 59.2954V54.6486C77.5646 52.4888 78.3333 50.6402 79.8708 49.1027C81.4083 47.5645 83.2569 46.7954 85.4167 46.7954C87.5764 46.7954 89.425 47.5645 90.9625 49.1027C92.5 50.6402 93.2687 52.4888 93.2687 54.6486V59.2954C94.3965 59.2954 95.3729 59.6413 96.1979 60.3329C97.0229 61.0246 97.4354 61.9076 97.4354 62.9819V75.4819C97.4354 76.5257 97.0823 77.401 96.376 78.1079C95.6698 78.8142 94.7944 79.1673 93.75 79.1673H77.0833ZM80.7687 59.2954H90.0646V54.6788C90.0646 53.3711 89.6118 52.2645 88.7063 51.359C87.8007 50.4534 86.7042 50.0007 85.4167 50.0007C84.1292 50.0007 83.0326 50.4534 82.1271 51.359C81.2215 52.2645 80.7687 53.3711 80.7687 54.6788V59.2954ZM19.2312 79.1673C17.3799 79.1673 15.7951 78.5083 14.4771 77.1902C13.159 75.8722 12.5 74.2875 12.5 72.4361V27.5652C12.5 25.7138 13.159 24.1291 14.4771 22.8111C15.7951 21.493 17.3799 20.834 19.2312 20.834H80.7687C82.6201 20.834 84.2049 21.493 85.5229 22.8111C86.841 24.1291 87.5 25.7138 87.5 27.5652V38.4621H85.4167C79.7861 38.4621 74.9865 40.4934 71.0177 44.5559C67.049 48.6184 65.0646 53.5048 65.0646 59.2152V79.1673H19.2312Z",
  fill: "#777A80"
}));

const mfaOtpLock = () => /*#__PURE__*/React.createElement("svg", {
  width: "100",
  height: "100",
  viewBox: "0 0 100 100",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, /*#__PURE__*/React.createElement("path", {
  d: "M26.6025 87.5C25.0574 87.5 23.7096 86.9248 22.5591 85.7743C21.4086 84.6238 20.8333 83.276 20.8333 81.7308V43.5736C20.8333 41.9871 21.4086 40.629 22.5591 39.4992C23.7096 38.3694 25.0574 37.8045 26.6025 37.8045H33.8141V28.6858C33.8141 24.1767 35.386 20.3518 38.53 17.2111C41.674 14.0704 45.5028 12.5 50.0165 12.5C54.5301 12.5 58.3534 14.0704 61.4864 17.2111C64.6194 20.3518 66.1859 24.1767 66.1859 28.6858V37.8045H73.3975C74.9426 37.8045 76.2905 38.3694 77.4409 39.4992C78.5914 40.629 79.1667 41.9871 79.1667 43.5736V81.7308C79.1667 83.276 78.5914 84.6238 77.4409 85.7743C76.2905 86.9248 74.9426 87.5 73.3975 87.5H26.6025ZM50.0175 68.75C51.6939 68.75 53.1264 68.1586 54.3149 66.9759C55.5035 65.7932 56.0978 64.368 56.0978 62.7003C56.0978 61.0977 55.4977 59.6728 54.2974 58.4255C53.0971 57.1782 51.6588 56.5545 49.9825 56.5545C48.3061 56.5545 46.8736 57.1782 45.6851 58.4255C44.4965 59.6728 43.9022 61.1151 43.9022 62.7524C43.9022 64.3897 44.5023 65.7986 45.7026 66.9792C46.9029 68.1597 48.3412 68.75 50.0175 68.75ZM37.0193 37.8045H62.9807V28.6858C62.9807 25.0801 61.7204 22.0152 59.1997 19.4911C56.6789 16.9671 53.618 15.7051 50.017 15.7051C46.4159 15.7051 43.3494 16.9671 40.8173 19.4911C38.2853 22.0152 37.0193 25.0801 37.0193 28.6858V37.8045Z",
  fill: "#777A80"
}));

const MfaModal = _ref => {
  let {
    closeModal,
    userEmail,
    isMfaEnabled,
    initialStep = 'QR_SCREEN',
    onMfaEnableStepComplete,
    onRecoveryEmailEnableStepComplete,
    successRedirect,
    showDialog,
    setShowDialog,
    cancelNavigation,
    confirmNavigation,
    isRecoveryEmailMandatory,
    onlyVerifyCode,
    onlyVerifyCodeSuccess,
    setupNewAuthenticator,
    setupNewAuthenticatorSuccess,
    recoveryEmail,
    onlyVerifyEmail,
    FormControl,
    generateMfaQrLink,
    SPModal,
    Button,
    DiscardMessage,
    TotpVerificationSignIn,
    verifyTotpSetupCode,
    callAPI,
    SpinnerSmallLoader,
    API_AUTH_BASE_URL,
    labels
  } = _ref;
  let startingStep = initialStep;
  if (onlyVerifyCode) {
    startingStep = 'OTP_VERIFICATION';
  }
  if (onlyVerifyEmail) {
    startingStep = 'RECOVERY_EMAIL_OTP_VERIFICATION';
  }
  const [modalStep, setModalPage] = useState(startingStep);
  const [didUserWannaLeave, setDidUserWannaLeave] = useState(true);
  const [isAuthenticatorOtpVerified, setIsAuthenticatorOtpVerified] = useState(false);
  const [isMailOtpVerified, setIsMailOtpVerified] = useState(false);
  const recoveryEmailRef = useRef('');
  useEffect(() => {
    successRedirect.current = '/setting/security';
  }, []);
  const handleVerifyOtp = code => {
    if (setupNewAuthenticator || !isMfaEnabled) {
      return verifyTotpSetupCode(code);
    }
    return TotpVerificationSignIn(code);
  };
  const handleOtpVerificationSubmit = async () => {
    if (onlyVerifyCode && onlyVerifyCodeSuccess) {
      onlyVerifyCodeSuccess();
      closeModal();
      return;
    }
    if (setupNewAuthenticator && recoveryEmail) {
      setupNewAuthenticatorSuccess();
      closeModal();
      return;
    }
    setModalPage('RECOVERY_EMAIL');
  };
  const handleCloseModal = () => {
    if (modalStep === 'OTP_VERIFICATION') {
      setShowDialog(true, true);
      setDidUserWannaLeave(true);
      return;
    }
    if (modalStep === 'RECOVERY_EMAIL') {
      if (isRecoveryEmailMandatory) {
        setShowDialog(true, true);
        setDidUserWannaLeave(true);
        return;
      }
      if (setupNewAuthenticator) {
        setupNewAuthenticatorSuccess();
        closeModal();
        return;
      }
      onMfaEnableStepComplete();
      closeModal();
      return;
    }
    if (modalStep === 'RECOVERY_EMAIL_OTP_VERIFICATION') {
      setShowDialog(true, true);
      setDidUserWannaLeave(true);
      return;
    }
    closeModal();
  };
  const handleRecoveryEmailSkip = () => {
    onMfaEnableStepComplete();
    closeModal();
  };
  const handleDiscardPopup = () => {
    setShowDialog(false);
    confirmNavigation();
    closeModal();
    if (isMailOtpVerified) {
      onRecoveryEmailEnableStepComplete(recoveryEmailRef.current);
    }
    if (isRecoveryEmailMandatory && !onlyVerifyCode) return;
    if (isAuthenticatorOtpVerified) {
      if (setupNewAuthenticator) {
        setupNewAuthenticatorSuccess();
        return;
      }
      if (onlyVerifyCode) {
        onlyVerifyCodeSuccess();
        return;
      }
      onMfaEnableStepComplete();
    }
  };
  const handleEmailVerifyOtp = async code => {
    const newRecoveryEmail = onlyVerifyEmail ? recoveryEmail : recoveryEmailRef && recoveryEmailRef.current;
    try {
      const response = await callAPI(`${API_AUTH_BASE_URL}/user/verify/otp`, 'POST', {
        recoveryEmail: newRecoveryEmail,
        otp: code
      });
      if (response && response.data && response.data.success) {
        return {
          success: response.data.success
        };
      }
      return {
        error: true
      };
    } catch (error) {
      return {
        error: true
      };
    }
  };
  const generateOtp = async () => {
    try {
      await callAPI(`${API_AUTH_BASE_URL}/user/generate/otp`, 'POST', {
        recoveryEmail: recoveryEmailRef.current
      });
      return {
        success: true
      };
    } catch (error) {
      return {
        error: true
      };
    }
  };
  const handleEmailOtpVerificationSubmit = () => {
    // if (!isRecoveryEmailMandatory) {
    //   onMfaEnableStepComplete();
    // }
    onRecoveryEmailEnableStepComplete(recoveryEmailRef.current);
    closeModal();
  };
  const onDismiss = () => {
    cancelNavigation();
  };
  const {
    TWO_FACTOR_AUTHENTICATOR_2FA,
    SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP,
    USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR,
    LEARN_MORE,
    NEXT,
    ADD_RECOVERY_EMAIL,
    LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP,
    SKIP,
    VERIFY,
    RESEND_CODE,
    ENTER_VERIFICATION_CODE,
    ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR,
    BACK,
    FINISH,
    CODE_IS_VERIFIED,
    CODE_IS_INVALID,
    ENTER_VERIFICATION_CODE_SENT_EMAIL,
    ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL,
    RECOVERY_EMAIL_HAS_BEEN_VERIFIED,
    CODE_HAS_EXPIRED,
    DISCARD,
    SAVE,
    DISCARD_UNSAVED_CHANGES,
    LOSE_EDIT_CHANGES_MSG,
    RECOVERY_EMAIL_MANDATORY,
    NOT_VALID_EMAIL
  } = labels;
  const getModalContent = () => {
    switch (modalStep) {
      case 'QR_SCREEN':
        return /*#__PURE__*/React.createElement(QRScreen, {
          next: () => setModalPage('OTP_VERIFICATION'),
          userEmail: userEmail,
          Button: Button,
          generateMfaQrLink: generateMfaQrLink,
          SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP: SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP,
          USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR: USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR,
          LEARN_MORE: LEARN_MORE,
          NEXT: NEXT
        });
      case 'OTP_VERIFICATION':
        return /*#__PURE__*/React.createElement(OtpVerification, {
          length: 6,
          isMfaEnabled: isMfaEnabled,
          primaryText: ENTER_VERIFICATION_CODE,
          secondaryText: ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR,
          Icon: mfaOtpLock,
          secondaryButtonText: BACK,
          goBack: () => setModalPage('QR_SCREEN'),
          primaryButtonText: onlyVerifyCode ? FINISH : NEXT,
          verifyOtp: handleVerifyOtp,
          successMessage: CODE_IS_VERIFIED,
          codeInvalidMessage: CODE_IS_INVALID,
          onComplete: handleOtpVerificationSubmit,
          isOtpVerified: isAuthenticatorOtpVerified,
          setIsOtpVerified: setIsAuthenticatorOtpVerified,
          Button: Button,
          SpinnerSmallLoader: SpinnerSmallLoader,
          RESEND_CODE: RESEND_CODE
        });
      case 'RECOVERY_EMAIL':
        return /*#__PURE__*/React.createElement(RecoveryEmail, {
          userEmail: userEmail,
          skip: handleRecoveryEmailSkip,
          onComplete: recoveryEmail => {
            recoveryEmailRef.current = recoveryEmail;
            setModalPage('RECOVERY_EMAIL_OTP_VERIFICATION');
            generateOtp();
          },
          isRecoveryEmailMandatory: isRecoveryEmailMandatory,
          Button: Button,
          FormControl: FormControl,
          ADD_RECOVERY_EMAIL: ADD_RECOVERY_EMAIL,
          LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP,
          SKIP: SKIP,
          VERIFY: VERIFY,
          RECOVERY_EMAIL_MANDATORY: RECOVERY_EMAIL_MANDATORY,
          NOT_VALID_EMAIL: NOT_VALID_EMAIL
        });
      case 'RECOVERY_EMAIL_OTP_VERIFICATION':
        return /*#__PURE__*/React.createElement(OtpVerification, {
          length: 6,
          isMfaEnabled: isMfaEnabled,
          primaryText: ENTER_VERIFICATION_CODE_SENT_EMAIL,
          secondaryText: ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL,
          Icon: emailOtpLock,
          secondaryButtonText: BACK,
          goBack: () => {
            if (onlyVerifyEmail) {
              closeModal();
              return;
            }
            setModalPage('RECOVERY_EMAIL');
          },
          primaryButtonText: FINISH,
          verifyOtp: handleEmailVerifyOtp,
          successMessage: RECOVERY_EMAIL_HAS_BEEN_VERIFIED,
          codeInvalidMessage: CODE_HAS_EXPIRED,
          onComplete: handleEmailOtpVerificationSubmit,
          isOtpVerified: isMailOtpVerified,
          setIsOtpVerified: setIsMailOtpVerified,
          showResendOption: true,
          resendOtp: generateOtp,
          Button: Button,
          SpinnerSmallLoader: SpinnerSmallLoader,
          RESEND_CODE: RESEND_CODE
        });
      default:
        return /*#__PURE__*/React.createElement(React.Fragment, null);
    }
  };
  return /*#__PURE__*/React.createElement(SPModal, {
    showModal: true,
    onCloseModal: handleCloseModal,
    closeOnOverlayClick: false,
    closeIcon: true,
    closeOnEsc: true,
    title: TWO_FACTOR_AUTHENTICATOR_2FA,
    classNames: {
      modal: 'popup-bg mfa-main-modal'
    },
    styles: {
      modal: {
        width: '678px',
        height: '468px'
      }
    }
  }, showDialog && /*#__PURE__*/React.createElement(DiscardMessage, {
    HeadTitle: DISCARD_UNSAVED_CHANGES,
    SubHeadTitle: LOSE_EDIT_CHANGES_MSG,
    isOpen: true,
    hasDiscardBtns: false,
    onDismiss: onDismiss
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    bsClass: "btn btn-secondary btn-medium ml-2",
    onClick: () => setShowDialog(false),
    disabled: false
  }, SAVE), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    bsClass: "btn btn-danger btn-medium ml-2",
    onClick: () => handleDiscardPopup(),
    disabled: false
  }, DISCARD)), getModalContent());
};
const MfaModalHOCWrapper = _ref2 => {
  let {
    HOC,
    ...props
  } = _ref2;
  const WrappedComponent = HOC(MfaModal);
  return /*#__PURE__*/React.createElement(WrappedComponent, props);
};

/* eslint-disable react/prop-types */
const SpinnerSmallLoader = _ref => {
  let {
    id,
    className
  } = _ref;
  return /*#__PURE__*/React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: `primary-loader ${className} `
  }, /*#__PURE__*/React.createElement("mask", {
    id: id,
    fill: "white"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 8C16 9.89522 15.3272 11.7289 14.1014 13.1743C12.8755 14.6197 11.1764 15.583 9.30662 15.8926C7.43685 16.2021 5.51791 15.8378 3.89169 14.8645C2.26547 13.8913 1.03759 12.3723 0.426816 10.5782C-0.183955 8.78405 -0.137946 6.83137 0.556646 5.06803C1.25124 3.30468 2.5493 1.84519 4.21955 0.949594C5.88981 0.0539972 7.82378 -0.219538 9.6769 0.177723C11.53 0.574984 13.1819 1.61724 14.3383 3.11879L13.1615 4.02504C12.2198 2.80227 10.8746 1.95352 9.36556 1.63002C7.8565 1.30651 6.28159 1.52926 4.92144 2.25858C3.56128 2.9879 2.50422 4.17642 1.93859 5.61238C1.37296 7.04834 1.33549 8.63848 1.83287 10.0995C2.33024 11.5605 3.33015 12.7975 4.65444 13.5901C5.97874 14.3826 7.54141 14.6793 9.06403 14.4272C10.5867 14.1752 11.9703 13.3907 12.9686 12.2136C13.9668 11.0366 14.5147 9.54335 14.5147 8H16Z"
  })), /*#__PURE__*/React.createElement("path", {
    d: "M16 8C16 9.89522 15.3272 11.7289 14.1014 13.1743C12.8755 14.6197 11.1764 15.583 9.30662 15.8926C7.43685 16.2021 5.51791 15.8378 3.89169 14.8645C2.26547 13.8913 1.03759 12.3723 0.426816 10.5782C-0.183955 8.78405 -0.137946 6.83137 0.556646 5.06803C1.25124 3.30468 2.5493 1.84519 4.21955 0.949594C5.88981 0.0539972 7.82378 -0.219538 9.6769 0.177723C11.53 0.574984 13.1819 1.61724 14.3383 3.11879L13.1615 4.02504C12.2198 2.80227 10.8746 1.95352 9.36556 1.63002C7.8565 1.30651 6.28159 1.52926 4.92144 2.25858C3.56128 2.9879 2.50422 4.17642 1.93859 5.61238C1.37296 7.04834 1.33549 8.63848 1.83287 10.0995C2.33024 11.5605 3.33015 12.7975 4.65444 13.5901C5.97874 14.3826 7.54141 14.6793 9.06403 14.4272C10.5867 14.1752 11.9703 13.3907 12.9686 12.2136C13.9668 11.0366 14.5147 9.54335 14.5147 8H16Z",
    stroke: "#0F67EA",
    strokeWidth: 3,
    mask: `url(#${id})`
  }));
};
SpinnerSmallLoader.defaultProps = {
  id: 'spinnerSmall',
  className: ''
};

const MfaSetupFlow = _ref => {
  let {
    userEmail,
    isMfaEnabled,
    onCloseModal,
    onMfaEnableStepComplete,
    onRecoveryEmailEnableStepComplete,
    isRecoveryEmailMandatory,
    onlyVerifyCode,
    onlyVerifyCodeSuccess,
    setupNewAuthenticator,
    setupNewAuthenticatorSuccess,
    recoveryEmail,
    onlyVerifyEmail,
    SPModal,
    Button,
    HOCUnsavePrompt,
    DiscardMessage,
    TotpVerificationSignIn,
    verifyTotpSetupCode,
    callAPI,
    API_AUTH_BASE_URL,
    SpinnerSmallLoader,
    FormControl,
    generateMfaQrLink,
    cognitoSignIn,
    labels
  } = _ref;
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(onlyVerifyEmail);
  const onPasswordConfirm = () => {
    setIsPasswordConfirmed(true);
  };
  const {
    PLEASE_CONFIRM_PASSWORD_ENABLE_2FA
  } = labels;
  return /*#__PURE__*/React.createElement(React.Fragment, null, isPasswordConfirmed ? /*#__PURE__*/React.createElement(MfaModalHOCWrapper, {
    HOC: HOCUnsavePrompt,
    closeModal: onCloseModal,
    userEmail: userEmail,
    isMfaEnabled: isMfaEnabled,
    onMfaEnableStepComplete: onMfaEnableStepComplete,
    onRecoveryEmailEnableStepComplete: onRecoveryEmailEnableStepComplete,
    isRecoveryEmailMandatory: isRecoveryEmailMandatory,
    onlyVerifyCode: onlyVerifyCode,
    onlyVerifyCodeSuccess: onlyVerifyCodeSuccess,
    setupNewAuthenticator: setupNewAuthenticator,
    recoveryEmail: recoveryEmail,
    setupNewAuthenticatorSuccess: setupNewAuthenticatorSuccess,
    onlyVerifyEmail: onlyVerifyEmail,
    FormControl: FormControl,
    generateMfaQrLink: generateMfaQrLink,
    SPModal: SPModal,
    Button: Button,
    DiscardMessage: DiscardMessage,
    TotpVerificationSignIn: TotpVerificationSignIn,
    verifyTotpSetupCode: verifyTotpSetupCode,
    callAPI: callAPI,
    SpinnerSmallLoader: SpinnerSmallLoader,
    API_AUTH_BASE_URL: API_AUTH_BASE_URL,
    labels: labels
  }) : /*#__PURE__*/React.createElement(ConfirmPasswordModal, {
    onCloseModal: onCloseModal,
    onPasswordConfirm: onPasswordConfirm,
    userEmail: userEmail,
    SPModal: SPModal,
    Button: Button,
    cognitoSignIn: cognitoSignIn,
    SpinnerSmallLoader: SpinnerSmallLoader,
    FormControl: FormControl,
    labels: labels,
    primaryText: PLEASE_CONFIRM_PASSWORD_ENABLE_2FA
  }));
};
MfaSetupFlow.propTypes = {
  userEmail: PropTypes.string.isRequired,
  isMfaEnabled: PropTypes.bool.isRequired,
  recoveryEmail: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onMfaEnableStepComplete: PropTypes.func.isRequired,
  onRecoveryEmailEnableStepComplete: PropTypes.func.isRequired,
  // flags
  isRecoveryEmailMandatory: PropTypes.bool,
  onlyVerifyEmail: PropTypes.bool,
  onlyVerifyCode: PropTypes.bool,
  onlyVerifyCodeSuccess: PropTypes.func,
  setupNewAuthenticator: PropTypes.bool,
  setupNewAuthenticatorSuccess: PropTypes.func,
  // api
  API_AUTH_BASE_URL: PropTypes.string.isRequired,
  TotpVerificationSignIn: PropTypes.func.isRequired,
  verifyTotpSetupCode: PropTypes.func.isRequired,
  cognitoSignIn: PropTypes.func.isRequired,
  generateMfaQrLink: PropTypes.func.isRequired,
  Button: PropTypes.elementType.isRequired,
  // try to remove this
  SPModal: PropTypes.elementType.isRequired,
  // temp ignore
  HOCUnsavePrompt: PropTypes.elementType.isRequired,
  // inside
  DiscardMessage: PropTypes.elementType.isRequired,
  callAPI: PropTypes.func.isRequired,
  SpinnerSmallLoader: PropTypes.elementType,
  FormControl: PropTypes.elementType,
  labels: PropTypes.shape({
    CONFIRM_PASSWORD: PropTypes.string.isRequired,
    CONFIRM: PropTypes.string.isRequired,
    PLEASE_CONFIRM_PASSWORD_ENABLE_2FA: PropTypes.string.isRequired,
    TWO_FACTOR_AUTHENTICATOR_2FA: PropTypes.string.isRequired,
    SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP: PropTypes.string.isRequired,
    USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR: PropTypes.string.isRequired,
    LEARN_MORE: PropTypes.string.isRequired,
    NEXT: PropTypes.string.isRequired,
    ADD_RECOVERY_EMAIL: PropTypes.string.isRequired,
    LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: PropTypes.string.isRequired,
    SKIP: PropTypes.string.isRequired,
    VERIFY: PropTypes.string.isRequired,
    RESEND_CODE: PropTypes.string.isRequired,
    ENTER_VERIFICATION_CODE: PropTypes.string.isRequired,
    ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR: PropTypes.string.isRequired,
    BACK: PropTypes.string.isRequired,
    FINISH: PropTypes.string.isRequired,
    CODE_IS_VERIFIED: PropTypes.string.isRequired,
    CODE_IS_INVALID: PropTypes.string.isRequired,
    ENTER_VERIFICATION_CODE_SENT_EMAIL: PropTypes.string.isRequired,
    ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL: PropTypes.string.isRequired,
    RECOVERY_EMAIL_HAS_BEEN_VERIFIED: PropTypes.string.isRequired,
    CODE_HAS_EXPIRED: PropTypes.string.isRequired,
    DISCARD: PropTypes.string.isRequired,
    SAVE: PropTypes.string.isRequired,
    DISCARD_UNSAVED_CHANGES: PropTypes.string.isRequired,
    LOSE_EDIT_CHANGES_MSG: PropTypes.string.isRequired,
    RECOVERY_EMAIL_MANDATORY: PropTypes.string.isRequired,
    NOT_VALID_EMAIL: PropTypes.string.isRequired
  }).isRequired
};
MfaSetupFlow.defaultProps = {
  FormControl: FormControl$1,
  setupNewAuthenticator: false,
  setupNewAuthenticatorSuccess: () => {},
  onlyVerifyEmail: false,
  isRecoveryEmailMandatory: true,
  onlyVerifyCode: false,
  onlyVerifyCodeSuccess: () => {},
  SpinnerSmallLoader: SpinnerSmallLoader
};

export { ConfirmPasswordModal, MfaSetupFlow, OtpInput };
