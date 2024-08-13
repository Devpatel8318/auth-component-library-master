import React, { useState, useRef, useEffect } from 'react';

import RecoveryEmail from './RecoveryEmail.jsx';
import QRScreen from './QRScreen.jsx';
import OtpVerification from './OtpVerification.jsx';
import EmailOtpLock from '../sharedComponents/emailOtpLockIcon.js';
import MfaOtpLockIcon from '../sharedComponents/mfaOtpLockIcon.js';

const MfaModal = ({
    closeModal,
    userEmail,
    isMfaEnabled,
    initialStep = 'QR_SCREEN',
    onMfaEnableStepComplete,
    onRecoveryEmailEnableStepComplete,
    //
    showDialog,
    setShowDialog,
    cancelNavigation,
    confirmNavigation,
    //
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
    SpinnerSmallLoader,
    labels,
    verifyEmailOtp,
    generateEmailOtp,
    successRedirect,
}) => {
    let startingStep = initialStep;

    if (onlyVerifyCode) {
        startingStep = 'OTP_VERIFICATION';
    }
    if (onlyVerifyEmail) {
        startingStep = 'RECOVERY_EMAIL_OTP_VERIFICATION';
    }

    const [modalStep, setModalPage] = useState(startingStep);
    const [isAuthenticatorOtpVerified, setIsAuthenticatorOtpVerified] =
        useState(false);
    const [isMailOtpVerified, setIsMailOtpVerified] = useState(false);
    const recoveryEmailRef = useRef('');

    useEffect(() => {
        successRedirect.current = '/setting/security';
    }, []);

    const handleVerifyOtp = (code) => {
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
            return;
        }

        if (modalStep === 'RECOVERY_EMAIL') {
            if (isRecoveryEmailMandatory) {
                setShowDialog(true, true);
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

    const handleVerifyEmailOtp = (code) => {
        const newRecoveryEmail = onlyVerifyEmail
            ? recoveryEmail
            : recoveryEmailRef && recoveryEmailRef.current;

        return verifyEmailOtp(code, newRecoveryEmail);
    };

    const handleGenerateEmailOtp = () => {
        if (recoveryEmailRef && recoveryEmailRef.current) {
            generateEmailOtp(recoveryEmailRef.current);
        }
    };

    const handleEmailOtpVerificationSubmit = () => {
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
        NOT_VALID_EMAIL,
    } = labels;

    const getModalContent = () => {
        switch (modalStep) {
            case 'QR_SCREEN':
                return (
                    <QRScreen
                        next={() => setModalPage('OTP_VERIFICATION')}
                        userEmail={userEmail}
                        Button={Button}
                        generateMfaQrLink={generateMfaQrLink}
                        SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP={
                            SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP
                        }
                        USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR={
                            USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR
                        }
                        LEARN_MORE={LEARN_MORE}
                        NEXT={NEXT}
                    />
                );

            case 'OTP_VERIFICATION':
                return (
                    <OtpVerification
                        length={6}
                        isMfaEnabled={isMfaEnabled}
                        primaryText={ENTER_VERIFICATION_CODE}
                        secondaryText={ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR}
                        Icon={MfaOtpLockIcon}
                        secondaryButtonText={BACK}
                        goBack={() => setModalPage('QR_SCREEN')}
                        primaryButtonText={onlyVerifyCode ? FINISH : NEXT}
                        verifyOtp={handleVerifyOtp}
                        successMessage={CODE_IS_VERIFIED}
                        codeInvalidMessage={CODE_IS_INVALID}
                        onComplete={handleOtpVerificationSubmit}
                        isOtpVerified={isAuthenticatorOtpVerified}
                        setIsOtpVerified={setIsAuthenticatorOtpVerified}
                        Button={Button}
                        SpinnerSmallLoader={SpinnerSmallLoader}
                        RESEND_CODE={RESEND_CODE}
                        setShowDialog={setShowDialog}
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
                            handleGenerateEmailOtp();
                        }}
                        isRecoveryEmailMandatory={isRecoveryEmailMandatory}
                        Button={Button}
                        FormControl={FormControl}
                        ADD_RECOVERY_EMAIL={ADD_RECOVERY_EMAIL}
                        LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP={
                            LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP
                        }
                        SKIP={SKIP}
                        VERIFY={VERIFY}
                        RECOVERY_EMAIL_MANDATORY={RECOVERY_EMAIL_MANDATORY}
                        NOT_VALID_EMAIL={NOT_VALID_EMAIL}
                        setShowDialog={setShowDialog}
                    />
                );

            case 'RECOVERY_EMAIL_OTP_VERIFICATION':
                return (
                    <OtpVerification
                        length={6}
                        isMfaEnabled={isMfaEnabled}
                        primaryText={ENTER_VERIFICATION_CODE_SENT_EMAIL}
                        secondaryText={ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL}
                        Icon={EmailOtpLock}
                        secondaryButtonText={BACK}
                        goBack={() => {
                            if (onlyVerifyEmail) {
                                closeModal();
                                return;
                            }
                            setModalPage('RECOVERY_EMAIL');
                        }}
                        primaryButtonText={FINISH}
                        verifyOtp={handleVerifyEmailOtp}
                        successMessage={RECOVERY_EMAIL_HAS_BEEN_VERIFIED}
                        codeInvalidMessage={CODE_HAS_EXPIRED}
                        onComplete={handleEmailOtpVerificationSubmit}
                        isOtpVerified={isMailOtpVerified}
                        setIsOtpVerified={setIsMailOtpVerified}
                        showResendOption
                        resendOtp={handleGenerateEmailOtp}
                        Button={Button}
                        SpinnerSmallLoader={SpinnerSmallLoader}
                        RESEND_CODE={RESEND_CODE}
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
            title={TWO_FACTOR_AUTHENTICATOR_2FA}
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
                    HeadTitle={DISCARD_UNSAVED_CHANGES}
                    SubHeadTitle={LOSE_EDIT_CHANGES_MSG}
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
                        {SAVE}
                    </Button>
                    <Button
                        type="submit"
                        bsClass="btn btn-danger btn-medium ml-2"
                        onClick={() => handleDiscardPopup()}
                        disabled={false}
                    >
                        {DISCARD}
                    </Button>
                </DiscardMessage>
            )}
            {getModalContent()}
        </SPModal>
    );
};

export default MfaModal;
