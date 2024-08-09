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
    className: "qr-code-loader mb-8"
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
  console.log({
    email,
    loginEmail,
    allowEmptyString,
    emailTester,
    DisplayText,
    getLocalizeText
  });
  if (!email || !email.trim()) {
    return allowEmptyString ? '' : getLocalizeText(DisplayText.RECOVERY_EMAIL_MANDATORY);
  }
  console.log('22');
  if (!emailTester(email)) return getLocalizeText(DisplayText.NOT_VALID_EMAIL);
  console.log('26');
  if (email === loginEmail) {
    return 'Recovery email cannot be same as login e-mail.';
  }
  console.log('33');
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
    getLocalizeText
  } = _ref;
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryEmailError, setRecoveryEmailError] = useState('');
  const recoveryEmailInputRef = useRef(null);
  const handleRecoveryEmailChange = e => {
    setRecoveryEmailError('');
    setRecoveryEmail(e.target.value.trim());
  };
  useEffect(() => {
    console.log('recoverEmail changed');
    if (!recoveryEmail) return setRecoveryEmailError('');
    const error = mfaRecoveryEmailValidator(recoveryEmail, userEmail, false, emailTester, DisplayText, getLocalizeText);
    console.log({
      error
    });
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

// as props
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
    sharedDisplayText,
    FormControl,
    generateMfaQrLink,
    SPModal,
    Button,
    DiscardMessage,
    DisplayText,
    getLocalizeText,
    GlobalDisplayTexts,
    TOTPVerificationSignIn,
    verifyTOTPSetupCode,
    callAPI,
    SpinnerSmallLoader,
    API_AUTH_BASE_URL,
    emailTester,
    EmailOtpLock,
    MfaOtpLockIcon,
    FormattedMessage
  } = _ref;
  console.log('47', {
    closeModal,
    userEmail,
    isMfaEnabled,
    initialStep,
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
    sharedDisplayText,
    FormControl,
    generateMfaQrLink,
    SPModal,
    Button,
    DiscardMessage,
    DisplayText,
    getLocalizeText,
    GlobalDisplayTexts,
    TOTPVerificationSignIn,
    verifyTOTPSetupCode,
    callAPI,
    SpinnerSmallLoader,
    API_AUTH_BASE_URL,
    emailTester,
    EmailOtpLock,
    MfaOtpLockIcon
  });
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
  const getModalContent = () => {
    switch (modalStep) {
      case 'QR_SCREEN':
        return /*#__PURE__*/React.createElement(QRScreen, {
          next: () => setModalPage('OTP_VERIFICATION'),
          userEmail: userEmail,
          Button: Button,
          generateMfaQrLink: generateMfaQrLink
        });
      case 'OTP_VERIFICATION':
        return /*#__PURE__*/React.createElement(OtpVerification, {
          length: 6,
          isMfaEnabled: isMfaEnabled,
          primaryText: "Enter Verification Code",
          secondaryText: "Enter the 6 Digit code from authenticator.",
          Icon: /*#__PURE__*/React.createElement(MfaOtpLockIcon, null),
          secondaryButtonText: "Back",
          goBack: () => setModalPage('QR_SCREEN'),
          primaryButtonText: onlyVerifyCode ? 'Finish' : 'Next',
          verifyOtp: handleVerifyOtp,
          successMessage: "Code is verified",
          codeInvalidMessage: "Code is Invalid",
          onComplete: handleOtpVerificationSubmit,
          isOtpVerified: isAuthenticatorOtpVerified,
          setIsOtpVerified: setIsAuthenticatorOtpVerified,
          Button: Button,
          SpinnerSmallLoader: SpinnerSmallLoader
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
          isOwner: isOwner,
          Button: Button,
          FormControl: FormControl,
          emailTester: emailTester,
          DisplayText: sharedDisplayText,
          getLocalizeText: getLocalizeText
        });
      case 'RECOVERY_EMAIL_OTP_VERIFICATION':
        return /*#__PURE__*/React.createElement(OtpVerification, {
          length: 6,
          isMfaEnabled: isMfaEnabled,
          primaryText: "Enter Verification Code Sent to e-mail",
          secondaryText: "Enter the 6 Digit code sent to your recovery e-mail.",
          Icon: /*#__PURE__*/React.createElement(EmailOtpLock, null),
          secondaryButtonText: "Back",
          goBack: () => {
            if (onlyVerifyEmail) {
              closeModal();
              return;
            }
            setModalPage('RECOVERY_EMAIL');
          },
          primaryButtonText: "Finish",
          verifyOtp: handleEmailVerifyOtp,
          successMessage: "Recovery email has been verified successfully."
          // TODO: handle this message
          ,
          codeInvalidMessage: "Code has expired.",
          onComplete: handleEmailOtpVerificationSubmit,
          isOtpVerified: isMailOtpVerified,
          setIsOtpVerified: setIsMailOtpVerified,
          showResendOption: showResendOption,
          resendOtp: generateOtp,
          Button: Button,
          SpinnerSmallLoader: SpinnerSmallLoader
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
    title: 'Two Factor Authentication (2FA)',
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
    HeadTitle: DisplayText.DISCARD_INVITE,
    SubHeadTitle: DisplayText.DISCARD_INVITE_CONFIRMATION
    // onClickClose={this.handleClosePopup}
    ,
    isOpen: true,
    hasDiscardBtns: false,
    onDismiss: onDismiss
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    bsClass: "btn btn-secondary btn-medium ml-2",
    onClick: () => setShowDialog(false),
    disabled: false
  }, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: getLocalizeText(GlobalDisplayTexts.SAVE),
    defaultMessage: getLocalizeText(GlobalDisplayTexts.SAVE)
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    bsClass: "btn btn-danger btn-medium ml-2",
    onClick: () => handleDiscardPopup(),
    disabled: false
  }, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: getLocalizeText(GlobalDisplayTexts.DISCARD),
    defaultMessage: getLocalizeText(GlobalDisplayTexts.DISCARD)
  }))), getModalContent());
};
const MfaModalHOCWrapper = _ref2 => {
  let {
    HOC,
    ...props
  } = _ref2;
  const WrappedComponent = HOC(MfaModal);
  return /*#__PURE__*/React.createElement(WrappedComponent, props);
};

export { HelloWorld, OtpInput, OtpVerification, QRScreen, RecoveryEmail, MfaModalHOCWrapper as mfaModal };
