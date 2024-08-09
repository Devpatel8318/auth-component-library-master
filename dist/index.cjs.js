'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');
var QRCode = require('react-qr-code');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);
var QRCode__default = /*#__PURE__*/_interopDefaultLegacy(QRCode);

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
  const inputRef = React.useRef(Array(length).fill(null));
  const [lastInputIndex, setLastInputIndex] = React.useState(null);
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
  React.useEffect(() => {
    if (!isLoading && lastInputIndex !== null && inputRef.current[lastInputIndex]) {
      inputRef.current[lastInputIndex].focus();
    }
  }, [isLoading, lastInputIndex]);
  React.useEffect(() => {
    inputRef.current[0].focus();
  }, []);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "d-flex justify-content-start w-100",
    onPaste: handlePaste
  }, Array.from({
    length
  }, (_, index) => /*#__PURE__*/React__default["default"].createElement("input", {
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
  length: PropTypes__default["default"].number.isRequired,
  OTP: PropTypes__default["default"].arrayOf(PropTypes__default["default"].string).isRequired,
  setOTP: PropTypes__default["default"].func.isRequired,
  isLoading: PropTypes__default["default"].bool.isRequired,
  errorMessage: PropTypes__default["default"].string,
  setErrorMessage: PropTypes__default["default"].func.isRequired,
  handleSubmit: PropTypes__default["default"].func.isRequired
};

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
    labels
  } = _ref;
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState('');
  const passwordInputRef = React.useRef(null);
  React.useEffect(() => {
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
    CONFIRM,
    PLEASE_CONFIRM_PASSWORD_ENABLE_2FA
  } = labels;
  return /*#__PURE__*/React__default["default"].createElement(SPModal, {
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
  }, /*#__PURE__*/React__default["default"].createElement("form", {
    onSubmit: handleSubmit,
    className: "row"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row mb-40"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 text-center"
  }, /*#__PURE__*/React__default["default"].createElement("h5", {
    className: "mfa-password-text mb-8 text-grey mt-0"
  }, PLEASE_CONFIRM_PASSWORD_ENABLE_2FA), /*#__PURE__*/React__default["default"].createElement("h3", {
    className: "mfa-password-email mb-2 mt-0"
  }, userEmail), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "form-group mb-0 position-relative"
  }, /*#__PURE__*/React__default["default"].createElement(FormControl, {
    type: "password",
    id: "mfa-confirm-password",
    ref: passwordInputRef,
    hasError: passwordError,
    errorMessage: passwordError,
    name: "confirmPassword",
    value: password,
    onChange: handlePasswordChange,
    bsClass: `text-center mfa-password-input-box`
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: `invalid-feedback ${passwordError ? 'd-block' : ''}`
  }, passwordError), isLoading && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "mt-1 input-spinner-loader"
  }, /*#__PURE__*/React__default["default"].createElement(SpinnerSmallLoader, {
    className: "circular-spinner mr-8"
  }))))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col d-flex justify-content-end"
  }, /*#__PURE__*/React__default["default"].createElement(Button, {
    bsClass: "btn btn-primary btn-medium",
    disabled: isLoading,
    variant: "primary",
    type: "submit"
  }, CONFIRM))))));
};
ConfirmPasswordModal.propTypes = {
  onCloseModal: PropTypes__default["default"].func.isRequired,
  onPasswordConfirm: PropTypes__default["default"].func.isRequired,
  userEmail: PropTypes__default["default"].string.isRequired,
  SPModal: PropTypes__default["default"].elementType.isRequired,
  Button: PropTypes__default["default"].elementType.isRequired,
  cognitoSignIn: PropTypes__default["default"].func.isRequired,
  SpinnerSmallLoader: PropTypes__default["default"].elementType.isRequired,
  FormControl: PropTypes__default["default"].elementType.isRequired,
  labels: PropTypes__default["default"].shape({
    CONFIRM_PASSWORD: PropTypes__default["default"].string.isRequired,
    CONFIRM: PropTypes__default["default"].string.isRequired,
    PLEASE_CONFIRM_PASSWORD_ENABLE_2FA: PropTypes__default["default"].string.isRequired
  }).isRequired
};

const mfaRecoveryEmailValidator = function (email, loginEmail) {
  let allowEmptyString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let emailTester = arguments.length > 3 ? arguments[3] : undefined;
  let RECOVERY_EMAIL_MANDATORY = arguments.length > 4 ? arguments[4] : undefined;
  let NOT_VALID_EMAIL = arguments.length > 5 ? arguments[5] : undefined;
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
    isOwner,
    Button,
    FormControl,
    emailTester,
    ADD_RECOVERY_EMAIL,
    LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP,
    SKIP,
    VERIFY,
    RECOVERY_EMAIL_MANDATORY,
    NOT_VALID_EMAIL
  } = _ref;
  const [recoveryEmail, setRecoveryEmail] = React.useState('');
  const [recoveryEmailError, setRecoveryEmailError] = React.useState('');
  const recoveryEmailInputRef = React.useRef(null);
  const handleRecoveryEmailChange = e => {
    setRecoveryEmailError('');
    setRecoveryEmail(e.target.value.trim());
  };
  React.useEffect(() => {
    if (!recoveryEmail) return setRecoveryEmailError('');
    const error = mfaRecoveryEmailValidator(recoveryEmail, userEmail, false, emailTester, RECOVERY_EMAIL_MANDATORY, NOT_VALID_EMAIL);
    if (error) {
      setRecoveryEmailError(error);
    }
  }, [recoveryEmail]);
  React.useEffect(() => {
    if (recoveryEmailInputRef.current) {
      recoveryEmailInputRef.current.focus();
    }
  }, []);
  const isBtnDisabled = !recoveryEmail.length || recoveryEmail.length && recoveryEmailError;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col text-center mt-2 mfa-recovery-container p-0"
  }, /*#__PURE__*/React__default["default"].createElement("h3", {
    className: "mfa-qr-text"
  }, ADD_RECOVERY_EMAIL), /*#__PURE__*/React__default["default"].createElement("h5", {
    className: "mfa-recovery-text-secondary mb-2"
  }, LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React__default["default"].createElement(FormControl, {
    type: "email",
    id: "mfa-recovery-email",
    ref: recoveryEmailInputRef,
    hasError: recoveryEmailError,
    errorMessage: recoveryEmailError,
    name: "recoveryEmail",
    value: recoveryEmail,
    onChange: handleRecoveryEmailChange,
    bsClass: `text-center mfa-password-input-box`
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: `invalid-feedback ${recoveryEmailError ? 'd-block' : ''}`
  }, recoveryEmailError)))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col d-flex justify-content-end"
  }, !isOwner && /*#__PURE__*/React__default["default"].createElement("a", {
    className: "delete-group btn-medium",
    href: "javascript:;",
    onClick: skip
  }, SKIP), /*#__PURE__*/React__default["default"].createElement(Button, {
    bsClass: "btn btn-primary btn-medium",
    disabled: !!isBtnDisabled,
    variant: "primary",
    onClick: () => onComplete(recoveryEmail)
  }, VERIFY)))));
};
RecoveryEmail.propTypes = {
  userEmail: PropTypes__default["default"].string.isRequired,
  skip: PropTypes__default["default"].func.isRequired,
  onComplete: PropTypes__default["default"].func.isRequired,
  isOwner: PropTypes__default["default"].bool.isRequired,
  Button: PropTypes__default["default"].elementType.isRequired,
  FormControl: PropTypes__default["default"].elementType.isRequired,
  emailTester: PropTypes__default["default"].func.isRequired,
  ADD_RECOVERY_EMAIL: PropTypes__default["default"].string.isRequired,
  LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: PropTypes__default["default"].string.isRequired,
  SKIP: PropTypes__default["default"].string.isRequired,
  VERIFY: PropTypes__default["default"].string.isRequired,
  RECOVERY_EMAIL_MANDATORY: PropTypes__default["default"].string.isRequired,
  NOT_VALID_EMAIL: PropTypes__default["default"].string.isRequired
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
  const [qrLink, setQRLink] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
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
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 text-center mt-2 mfa-qr-container p-0"
  }, isLoading ? /*#__PURE__*/React__default["default"].createElement("div", {
    className: "qr-code-loader mb-8"
  }) : /*#__PURE__*/React__default["default"].createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React__default["default"].createElement(QRCode__default["default"], {
    size: 200,
    value: qrLink
  })), /*#__PURE__*/React__default["default"].createElement("h3", {
    className: "mfa-qr-text mt-0 mb-8"
  }, SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP), /*#__PURE__*/React__default["default"].createElement("p", {
    className: "mb-0 text-grey"
  }, USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR, /*#__PURE__*/React__default["default"].createElement("a", {
    href: "https://help.socialpilot.co/article/438-why-am-i-being-asked-to-re-connect-my-accounts#Account-disconnection-due-to-Missing-Roles-andor-Permissions-on-Faceb-VNHYK",
    target: "_blank",
    rel: "noopener noreferrer"
  }, ' ', LEARN_MORE)))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col d-flex justify-content-end"
  }, /*#__PURE__*/React__default["default"].createElement(Button, {
    bsClass: `btn btn-primary btn-medium`,
    disabled: false,
    variant: "primary",
    onClick: next
  }, NEXT)))));
}
QRScreen.propTypes = {
  next: PropTypes__default["default"].func.isRequired,
  userEmail: PropTypes__default["default"].string.isRequired,
  Button: PropTypes__default["default"].elementType.isRequired,
  generateMfaQrLink: PropTypes__default["default"].func.isRequired,
  SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP: PropTypes__default["default"].string.isRequired,
  USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR: PropTypes__default["default"].string.isRequired,
  LEARN_MORE: PropTypes__default["default"].string.isRequired,
  NEXT: PropTypes__default["default"].string.isRequired
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
  const [OTP, setOTP] = React.useState(Array(length).fill(''));
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
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
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 text-center mt-2 mfa-qr-container p-0"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row flex-column justify-content-center"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 mb-2"
  }, Icon), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 mb-2"
  }, /*#__PURE__*/React__default["default"].createElement("h3", {
    className: "mfa-otp-text mb-8"
  }, primaryText), /*#__PURE__*/React__default["default"].createElement("p", {
    className: "mb-0 text-grey"
  }, secondaryText)), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12 mb-1 position-relative"
  }, /*#__PURE__*/React__default["default"].createElement(OtpInput, {
    length: length,
    OTP: OTP,
    setOTP: setOTP,
    isLoading: isLoading,
    setIsLoading: setIsLoading,
    errorMessage: errorMessage,
    setErrorMessage: setErrorMessage,
    handleSubmit: handleSubmit
  }), isLoading && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "mt-8 mfa-otp-spinner-loader"
  }, /*#__PURE__*/React__default["default"].createElement(SpinnerSmallLoader, {
    className: "circular-spinner mr-8"
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12"
  }, errorMessage && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "text-danger mfa-otp-message-text"
  }, errorMessage, ' ', showResendOption ? /*#__PURE__*/React__default["default"].createElement("a", {
    className: "delete-group",
    href: "javascript:;",
    onClick: resendOtp
  }, RESEND_CODE) : ''), !isLoading && !errorMessage && OTP.every(digit => digit !== '') && /*#__PURE__*/React__default["default"].createElement("div", {
    className: "text-success mfa-otp-message-text"
  }, successMessage))))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "col-lg-12"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "d-flex justify-content-end align-items-center"
  }, /*#__PURE__*/React__default["default"].createElement("a", {
    className: "",
    href: "javascript:;",
    onClick: goBack
  }, secondaryButtonText), /*#__PURE__*/React__default["default"].createElement(Button, {
    bsClass: "btn btn-primary btn-medium ml-2",
    disabled: !isOtpVerified,
    variant: "primary",
    onClick: onComplete
  }, primaryButtonText))))));
};
OtpVerification.propTypes = {
  length: PropTypes__default["default"].number,
  primaryText: PropTypes__default["default"].string.isRequired,
  secondaryText: PropTypes__default["default"].string.isRequired,
  Icon: PropTypes__default["default"].node,
  secondaryButtonText: PropTypes__default["default"].string.isRequired,
  goBack: PropTypes__default["default"].func.isRequired,
  primaryButtonText: PropTypes__default["default"].string.isRequired,
  verifyOtp: PropTypes__default["default"].func.isRequired,
  successMessage: PropTypes__default["default"].string.isRequired,
  codeInvalidMessage: PropTypes__default["default"].string.isRequired,
  onComplete: PropTypes__default["default"].func.isRequired,
  isOtpVerified: PropTypes__default["default"].bool.isRequired,
  setIsOtpVerified: PropTypes__default["default"].func.isRequired,
  showResendOption: PropTypes__default["default"].bool.isRequired,
  resendOtp: PropTypes__default["default"].func.isRequired,
  Button: PropTypes__default["default"].elementType.isRequired,
  SpinnerSmallLoader: PropTypes__default["default"].elementType.isRequired,
  RESEND_CODE: PropTypes__default["default"].string.isRequired
};

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
    isOwner,
    onlyVerifyCode,
    onlyVerifyCodeSuccess,
    setupNewAuthenticator,
    setupNewAuthenticatorSuccess,
    recoveryEmail,
    onlyVerifyEmail,
    showResendOption,
    FormControl,
    generateMfaQrLink,
    SPModal,
    Button,
    DiscardMessage,
    TOTPVerificationSignIn,
    verifyTOTPSetupCode,
    callAPI,
    SpinnerSmallLoader,
    API_AUTH_BASE_URL,
    emailTester,
    EmailOtpLock,
    MfaOtpLockIcon,
    FormattedMessage,
    recoveryEmailOtplength,
    labels
  } = _ref;
  let startingStep = initialStep;
  if (onlyVerifyCode) {
    startingStep = 'OTP_VERIFICATION';
  }
  if (onlyVerifyEmail) {
    startingStep = 'RECOVERY_EMAIL_OTP_VERIFICATION';
  }
  const [modalStep, setModalPage] = React.useState(startingStep);
  const [didUserWannaLeave, setDidUserWannaLeave] = React.useState(true);
  const [isAuthenticatorOtpVerified, setIsAuthenticatorOtpVerified] = React.useState(false);
  const [isMailOtpVerified, setIsMailOtpVerified] = React.useState(false);
  const recoveryEmailRef = React.useRef('');
  React.useEffect(() => {
    successRedirect.current = '/setting/security';
  }, []);
  const handleVerifyOtp = code => {
    if (setupNewAuthenticator || !isMfaEnabled) {
      return verifyTOTPSetupCode(code);
    }
    return TOTPVerificationSignIn(code);
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
      if (isOwner) {
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
    if (isOwner && !onlyVerifyCode) return;
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
    // if (!isOwner) {
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
    DISCARD_INVITE,
    DISCARD_INVITE_CONFIRMATION,
    RECOVERY_EMAIL_MANDATORY,
    NOT_VALID_EMAIL
  } = labels;
  const getModalContent = () => {
    switch (modalStep) {
      case 'QR_SCREEN':
        return /*#__PURE__*/React__default["default"].createElement(QRScreen, {
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
        return /*#__PURE__*/React__default["default"].createElement(OtpVerification, {
          length: 6,
          isMfaEnabled: isMfaEnabled,
          primaryText: ENTER_VERIFICATION_CODE,
          secondaryText: ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR,
          Icon: /*#__PURE__*/React__default["default"].createElement(MfaOtpLockIcon, null),
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
        return /*#__PURE__*/React__default["default"].createElement(RecoveryEmail, {
          userEmail: userEmail,
          skip: handleRecoveryEmailSkip,
          onComplete: recoveryEmail => {
            recoveryEmailRef.current = recoveryEmail;
            setModalPage('RECOVERY_EMAIL_OTP_VERIFICATION');
            generateOtp();
          },
          isOwner: isOwner,
          Button: Button,
          FormControl: FormControl,
          emailTester: emailTester,
          ADD_RECOVERY_EMAIL: ADD_RECOVERY_EMAIL,
          LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP,
          SKIP: SKIP,
          VERIFY: VERIFY,
          RECOVERY_EMAIL_MANDATORY: RECOVERY_EMAIL_MANDATORY,
          NOT_VALID_EMAIL: NOT_VALID_EMAIL
        });
      case 'RECOVERY_EMAIL_OTP_VERIFICATION':
        return /*#__PURE__*/React__default["default"].createElement(OtpVerification, {
          length: recoveryEmailOtplength,
          isMfaEnabled: isMfaEnabled,
          primaryText: ENTER_VERIFICATION_CODE_SENT_EMAIL,
          secondaryText: ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL,
          Icon: /*#__PURE__*/React__default["default"].createElement(EmailOtpLock, null),
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
          showResendOption: showResendOption,
          resendOtp: generateOtp,
          Button: Button,
          SpinnerSmallLoader: SpinnerSmallLoader,
          RESEND_CODE: RESEND_CODE
        });
      default:
        return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null);
    }
  };
  return /*#__PURE__*/React__default["default"].createElement(SPModal, {
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
  }, showDialog && /*#__PURE__*/React__default["default"].createElement(DiscardMessage, {
    HeadTitle: DISCARD_INVITE,
    SubHeadTitle: DISCARD_INVITE_CONFIRMATION,
    isOpen: true,
    hasDiscardBtns: false,
    onDismiss: onDismiss
  }, /*#__PURE__*/React__default["default"].createElement(Button, {
    type: "submit",
    bsClass: "btn btn-secondary btn-medium ml-2",
    onClick: () => setShowDialog(false),
    disabled: false
  }, /*#__PURE__*/React__default["default"].createElement(FormattedMessage, {
    id: SAVE,
    defaultMessage: SAVE
  })), /*#__PURE__*/React__default["default"].createElement(Button, {
    type: "submit",
    bsClass: "btn btn-danger btn-medium ml-2",
    onClick: () => handleDiscardPopup(),
    disabled: false
  }, /*#__PURE__*/React__default["default"].createElement(FormattedMessage, {
    id: DISCARD,
    defaultMessage: DISCARD
  }))), getModalContent());
};
const MfaModalHOCWrapper = _ref2 => {
  let {
    HOC,
    ...props
  } = _ref2;
  const WrappedComponent = HOC(MfaModal);
  return /*#__PURE__*/React__default["default"].createElement(WrappedComponent, props);
};

const MfaSetupFlow = _ref => {
  let {
    userEmail,
    isMfaEnabled,
    onCloseModal,
    onMfaEnableStepComplete,
    onRecoveryEmailEnableStepComplete,
    isOwner,
    onlyVerifyCode,
    onlyVerifyCodeSuccess,
    setupNewAuthenticator,
    setupNewAuthenticatorSuccess,
    recoveryEmail,
    onlyVerifyEmail,
    showResendOption,
    SPModal,
    Button,
    HOCUnsavePrompt,
    DiscardMessage,
    TOTPVerificationSignIn,
    verifyTOTPSetupCode,
    callAPI,
    API_AUTH_BASE_URL,
    emailTester,
    SpinnerSmallLoader,
    FormControl,
    generateMfaQrLink,
    MfaOtpLockIcon,
    EmailOtpLock,
    FormattedMessage,
    cognitoSignIn,
    recoveryEmailOtplength,
    labels
  } = _ref;
  const [isPasswordConfirmed, setIsPasswordConfirmed] = React.useState(onlyVerifyEmail);
  const onPasswordConfirm = () => {
    setIsPasswordConfirmed(true);
  };
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, isPasswordConfirmed ? /*#__PURE__*/React__default["default"].createElement(MfaModalHOCWrapper, {
    HOC: HOCUnsavePrompt,
    closeModal: onCloseModal,
    userEmail: userEmail,
    isMfaEnabled: isMfaEnabled,
    onMfaEnableStepComplete: onMfaEnableStepComplete,
    onRecoveryEmailEnableStepComplete: onRecoveryEmailEnableStepComplete,
    isOwner: isOwner,
    onlyVerifyCode: onlyVerifyCode,
    onlyVerifyCodeSuccess: onlyVerifyCodeSuccess,
    setupNewAuthenticator: setupNewAuthenticator,
    recoveryEmail: recoveryEmail,
    setupNewAuthenticatorSuccess: setupNewAuthenticatorSuccess,
    onlyVerifyEmail: onlyVerifyEmail,
    showResendOption: showResendOption,
    FormControl: FormControl,
    generateMfaQrLink: generateMfaQrLink,
    SPModal: SPModal,
    Button: Button,
    DiscardMessage: DiscardMessage,
    TOTPVerificationSignIn: TOTPVerificationSignIn,
    verifyTOTPSetupCode: verifyTOTPSetupCode,
    callAPI: callAPI,
    SpinnerSmallLoader: SpinnerSmallLoader,
    API_AUTH_BASE_URL: API_AUTH_BASE_URL,
    emailTester: emailTester,
    EmailOtpLock: EmailOtpLock,
    MfaOtpLockIcon: MfaOtpLockIcon,
    HOCUnsavePrompt: HOCUnsavePrompt,
    FormattedMessage: FormattedMessage,
    recoveryEmailOtplength: recoveryEmailOtplength,
    labels: labels
  }) : /*#__PURE__*/React__default["default"].createElement(ConfirmPasswordModal, {
    onCloseModal: onCloseModal,
    onPasswordConfirm: onPasswordConfirm,
    userEmail: userEmail,
    SPModal: SPModal,
    Button: Button,
    cognitoSignIn: cognitoSignIn,
    SpinnerSmallLoader: SpinnerSmallLoader,
    FormControl: FormControl,
    labels: labels
  }));
};
MfaSetupFlow.propTypes = {
  userEmail: PropTypes__default["default"].string.isRequired,
  isMfaEnabled: PropTypes__default["default"].bool.isRequired,
  onCloseModal: PropTypes__default["default"].func.isRequired,
  onMfaEnableStepComplete: PropTypes__default["default"].func.isRequired,
  onRecoveryEmailEnableStepComplete: PropTypes__default["default"].func.isRequired,
  isOwner: PropTypes__default["default"].bool.isRequired,
  onlyVerifyCode: PropTypes__default["default"].bool.isRequired,
  onlyVerifyCodeSuccess: PropTypes__default["default"].bool.isRequired,
  setupNewAuthenticator: PropTypes__default["default"].bool.isRequired,
  setupNewAuthenticatorSuccess: PropTypes__default["default"].bool.isRequired,
  recoveryEmail: PropTypes__default["default"].string.isRequired,
  onlyVerifyEmail: PropTypes__default["default"].bool.isRequired,
  showResendOption: PropTypes__default["default"].bool.isRequired,
  SPModal: PropTypes__default["default"].elementType.isRequired,
  Button: PropTypes__default["default"].elementType.isRequired,
  HOCUnsavePrompt: PropTypes__default["default"].elementType.isRequired,
  DiscardMessage: PropTypes__default["default"].elementType.isRequired,
  TOTPVerificationSignIn: PropTypes__default["default"].func.isRequired,
  verifyTOTPSetupCode: PropTypes__default["default"].func.isRequired,
  callAPI: PropTypes__default["default"].func.isRequired,
  API_AUTH_BASE_URL: PropTypes__default["default"].string.isRequired,
  emailTester: PropTypes__default["default"].func.isRequired,
  SpinnerSmallLoader: PropTypes__default["default"].elementType.isRequired,
  FormControl: PropTypes__default["default"].elementType.isRequired,
  generateMfaQrLink: PropTypes__default["default"].func.isRequired,
  MfaOtpLockIcon: PropTypes__default["default"].node.isRequired,
  EmailOtpLock: PropTypes__default["default"].node.isRequired,
  FormattedMessage: PropTypes__default["default"].elementType.isRequired,
  cognitoSignIn: PropTypes__default["default"].func.isRequired,
  recoveryEmailOtplength: PropTypes__default["default"].number.isRequired,
  labels: PropTypes__default["default"].shape({
    CONFIRM_PASSWORD: PropTypes__default["default"].string.isRequired,
    CONFIRM: PropTypes__default["default"].string.isRequired,
    PLEASE_CONFIRM_PASSWORD_ENABLE_2FA: PropTypes__default["default"].string.isRequired,
    TWO_FACTOR_AUTHENTICATOR_2FA: PropTypes__default["default"].string.isRequired,
    SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP: PropTypes__default["default"].string.isRequired,
    USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR: PropTypes__default["default"].string.isRequired,
    LEARN_MORE: PropTypes__default["default"].string.isRequired,
    NEXT: PropTypes__default["default"].string.isRequired,
    ADD_RECOVERY_EMAIL: PropTypes__default["default"].string.isRequired,
    LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: PropTypes__default["default"].string.isRequired,
    SKIP: PropTypes__default["default"].string.isRequired,
    VERIFY: PropTypes__default["default"].string.isRequired,
    RESEND_CODE: PropTypes__default["default"].string.isRequired,
    ENTER_VERIFICATION_CODE: PropTypes__default["default"].string.isRequired,
    ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR: PropTypes__default["default"].string.isRequired,
    BACK: PropTypes__default["default"].string.isRequired,
    FINISH: PropTypes__default["default"].string.isRequired,
    CODE_IS_VERIFIED: PropTypes__default["default"].string.isRequired,
    CODE_IS_INVALID: PropTypes__default["default"].string.isRequired,
    ENTER_VERIFICATION_CODE_SENT_EMAIL: PropTypes__default["default"].string.isRequired,
    ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL: PropTypes__default["default"].string.isRequired,
    RECOVERY_EMAIL_HAS_BEEN_VERIFIED: PropTypes__default["default"].string.isRequired,
    CODE_HAS_EXPIRED: PropTypes__default["default"].string.isRequired,
    DISCARD: PropTypes__default["default"].string.isRequired,
    SAVE: PropTypes__default["default"].string.isRequired,
    DISCARD_INVITE: PropTypes__default["default"].string.isRequired,
    DISCARD_INVITE_CONFIRMATION: PropTypes__default["default"].string.isRequired,
    RECOVERY_EMAIL_MANDATORY: PropTypes__default["default"].string.isRequired,
    NOT_VALID_EMAIL: PropTypes__default["default"].string.isRequired
  }).isRequired
};

exports.MfaSetupFlow = MfaSetupFlow;
exports.OtpInput = OtpInput;
