import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import RecoveryEmail from './RecoveryEmail';
import QRScreen from './QRScreen';
import OtpVerification from './OtpVerification';

// as props
const MfaModal = ({
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
}) => {
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
        MfaOtpLockIcon,
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
    const [isAuthenticatorOtpVerified, setIsAuthenticatorOtpVerified] =
        useState(false);
    const [isMailOtpVerified, setIsMailOtpVerified] = useState(false);
    const recoveryEmailRef = useRef('');

    useEffect(() => {
        successRedirect.current = '/setting/security';
    }, []);

    const handleVerifyOtp = (code) => {
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

    const handleEmailVerifyOtp = async (code) => {
        const newRecoveryEmail = onlyVerifyEmail
            ? recoveryEmail
            : recoveryEmailRef?.current;

        try {
            const response = await callAPI(
                `${API_AUTH_BASE_URL}/user/verify/otp`,
                'POST',
                {
                    recoveryEmail: newRecoveryEmail,
                    otp: code,
                }
            );
            if (response && response.data && response.data.success) {
                return {
                    success: response.data.success,
                };
            }
            return {
                error: true,
            };
        } catch (error) {
            return {
                error: true,
            };
        }
    };

    const generateOtp = async () => {
        try {
            await callAPI(`${API_AUTH_BASE_URL}/user/generate/otp`, 'POST', {
                recoveryEmail: recoveryEmailRef.current,
            });
            return {
                success: true,
            };
        } catch (error) {
            return {
                error: true,
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
                return (
                    <QRScreen
                        next={() => setModalPage('OTP_VERIFICATION')}
                        userEmail={userEmail}
                        Button={Button}
                        generateMfaQrLink={generateMfaQrLink}
                    />
                );

            case 'OTP_VERIFICATION':
                return (
                    <OtpVerification
                        length={6}
                        isMfaEnabled={isMfaEnabled}
                        primaryText="Enter Verification Code"
                        secondaryText="Enter the 6 Digit code from authenticator."
                        Icon={<MfaOtpLockIcon />}
                        secondaryButtonText="Back"
                        goBack={() => setModalPage('QR_SCREEN')}
                        primaryButtonText={onlyVerifyCode ? 'Finish' : 'Next'}
                        verifyOtp={handleVerifyOtp}
                        successMessage="Code is verified"
                        codeInvalidMessage="Code is Invalid"
                        onComplete={handleOtpVerificationSubmit}
                        isOtpVerified={isAuthenticatorOtpVerified}
                        setIsOtpVerified={setIsAuthenticatorOtpVerified}
                        Button={Button}
                        SpinnerSmallLoader={SpinnerSmallLoader}
                    />
                );

            case 'RECOVERY_EMAIL':
                return (
                    <RecoveryEmail
                        userEmail={userEmail}
                        skip={handleRecoveryEmailSkip}
                        onComplete={(recoveryEmail) => {
                            recoveryEmailRef.current = recoveryEmail;
                            setModalPage('RECOVERY_EMAIL_OTP_VERIFICATION');
                            generateOtp();
                        }}
                        isOwner={isOwner}
                        Button={Button}
                        FormControl={FormControl}
                        emailTester={emailTester}
                        DisplayText={sharedDisplayText}
                        getLocalizeText={getLocalizeText}
                    />
                );

            case 'RECOVERY_EMAIL_OTP_VERIFICATION':
                return (
                    <OtpVerification
                        length={6}
                        isMfaEnabled={isMfaEnabled}
                        primaryText="Enter Verification Code Sent to e-mail"
                        secondaryText="Enter the 6 Digit code sent to your recovery e-mail."
                        Icon={<EmailOtpLock />}
                        secondaryButtonText="Back"
                        goBack={() => {
                            if (onlyVerifyEmail) {
                                closeModal();
                                return;
                            }
                            setModalPage('RECOVERY_EMAIL');
                        }}
                        primaryButtonText="Finish"
                        verifyOtp={handleEmailVerifyOtp}
                        successMessage="Recovery email has been verified successfully."
                        // TODO: handle this message
                        codeInvalidMessage="Code has expired."
                        onComplete={handleEmailOtpVerificationSubmit}
                        isOtpVerified={isMailOtpVerified}
                        setIsOtpVerified={setIsMailOtpVerified}
                        showResendOption={showResendOption}
                        resendOtp={generateOtp}
                        Button={Button}
                        SpinnerSmallLoader={SpinnerSmallLoader}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <SPModal
            showModal
            onCloseModal={handleCloseModal}
            closeOnOverlayClick={false}
            closeIcon
            closeOnEsc
            title={'Two Factor Authentication (2FA)'}
            classNames={{
                modal: 'popup-bg mfa-main-modal',
            }}
            styles={{
                modal: {
                    width: '678px',
                    height: '468px',
                },
            }}
        >
            {showDialog && (
                <DiscardMessage
                    HeadTitle={DisplayText.DISCARD_INVITE}
                    SubHeadTitle={DisplayText.DISCARD_INVITE_CONFIRMATION}
                    // onClickClose={this.handleClosePopup}
                    isOpen
                    hasDiscardBtns={false}
                    onDismiss={onDismiss}
                >
                    <Button
                        type="submit"
                        bsClass="btn btn-secondary btn-medium ml-2"
                        onClick={() => setShowDialog(false)}
                        disabled={false}
                    >
                        <FormattedMessage
                            id={getLocalizeText(GlobalDisplayTexts.SAVE)}
                            defaultMessage={getLocalizeText(
                                GlobalDisplayTexts.SAVE
                            )}
                        />
                    </Button>
                    <Button
                        type="submit"
                        bsClass="btn btn-danger btn-medium ml-2"
                        onClick={() => handleDiscardPopup()}
                        disabled={false}
                    >
                        <FormattedMessage
                            id={getLocalizeText(GlobalDisplayTexts.DISCARD)}
                            defaultMessage={getLocalizeText(
                                GlobalDisplayTexts.DISCARD
                            )}
                        />
                    </Button>
                </DiscardMessage>
            )}
            {getModalContent()}
        </SPModal>
    );
};

const wrappedComponent = (props) => {
    console.log(355, { props });
    const { HOCUnsavePrompt } = props;
    return HOCUnsavePrompt(MfaModal);
};

export default wrappedComponent;
