/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ConfirmPasswordModal from './ConfirmPasswordModal.jsx';
import './index.scss';
import FormControl from '../sharedComponents/FormControl.js';
import SpinnerSmallLoader from '../sharedComponents/SpinnerSmallLoader.js';
import Button from '../sharedComponents/Button.jsx';

import RecoveryEmail from './RecoveryEmail.jsx';
import QRScreen from './QRScreen.jsx';
import OtpVerification from './OtpVerification.jsx';
import EmailOtpLock from '../sharedComponents/emailOtpLockIcon.js';
import MfaOtpLockIcon from '../sharedComponents/mfaOtpLockIcon.js';

const MfaSetupFlow = ({
    userEmail,
    isMfaEnabled,
    onSetupClose,
    onMfaEnableStepComplete,
    onRecoveryEmailEnableStepComplete,
    isRecoveryEmailMandatory,
    onlyVerifyCode,
    onlyVerifyCodeSuccess,
    setupNewAuthenticator,
    setupNewAuthenticatorSuccess,
    recoveryEmail,
    onlyVerifyEmail,
    Button,
    DiscardMessage,
    TotpVerificationSignIn,
    verifyTotpSetupCode,
    SpinnerSmallLoader,
    FormControl,
    generateMfaQrLink,
    cognitoSignIn,
    labels,
    verifyEmailOtp,
    generateEmailOtp,
    //HOC props
    showDialog,
    setShowDialog,
    cancelNavigation,
    confirmNavigation,
    //
    didUserWannaCloseModal,
    setModalConfig,
}) => {
    const {
        CONFIRM_PASSWORD,
        CONFIRM,
        PLEASE_CONFIRM_PASSWORD_ENABLE_2FA,
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

    const firstStep = onlyVerifyEmail
        ? 'RECOVERY_EMAIL_OTP_VERIFICATION'
        : 'CONFIRM_PASSWORD';

    const [modalStep, setModalPage] = useState(firstStep);
    const [isAuthenticatorOtpVerified, setIsAuthenticatorOtpVerified] =
        useState(false);
    const [isMailOtpVerified, setIsMailOtpVerified] = useState(false);
    const recoveryEmailRef = useRef('');

    const handleVerifyOtp = (code) => {
        if (setupNewAuthenticator || !isMfaEnabled) {
            return verifyTotpSetupCode(code);
        }
        return TotpVerificationSignIn(code);
    };

    const handleOtpVerificationSubmit = async () => {
        if (onlyVerifyCode && onlyVerifyCodeSuccess) {
            onlyVerifyCodeSuccess();
            onSetupClose();
            return;
        }
        if (setupNewAuthenticator && recoveryEmail) {
            setupNewAuthenticatorSuccess();
            onSetupClose();
            return;
        }
        setModalPage('RECOVERY_EMAIL');
    };

    const handleCloseModal = () => {
        if (modalStep === 'CONFIRM_PASSWORD') {
            onSetupClose();
        }

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
                onSetupClose();
                return;
            }

            onMfaEnableStepComplete();
            onSetupClose();
            return;
        }

        if (modalStep === 'RECOVERY_EMAIL_OTP_VERIFICATION') {
            setShowDialog(true, true);
            return;
        }

        onSetupClose();
    };

    const handleRecoveryEmailSkip = () => {
        onMfaEnableStepComplete();
        onSetupClose();
    };

    const handleDiscardPopup = () => {
        setShowDialog(false);
        confirmNavigation();
        onSetupClose();

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
        onSetupClose();
    };

    const onDismiss = () => {
        cancelNavigation();
    };

    const onPasswordConfirm = () => {
        const startingStep = onlyVerifyCode ? 'OTP_VERIFICATION' : 'QR_SCREEN';
        setModalPage(startingStep);
    };

    useEffect(() => {
        if (modalStep === 'CONFIRM_PASSWORD') {
            setModalConfig({
                title: 'Confirm Password',
                dimensions: { width: '442px', height: 'auto' },
                css: 'popup-bg mfa-password-modal',
            });
        } else {
            setModalConfig({
                title: 'Two Factor Authentication (2FA)',
                dimensions: { width: '678px', height: '468px' },
                css: 'popup-bg mfa-main-modal',
            });
        }
    }, [modalStep]);

    useEffect(() => {
        if (didUserWannaCloseModal) {
            handleCloseModal();
        }
    }, [didUserWannaCloseModal]);

    const getModalContent = () => {
        switch (modalStep) {
            case 'CONFIRM_PASSWORD':
                return (
                    <ConfirmPasswordModal
                        onPasswordConfirm={onPasswordConfirm}
                        userEmail={userEmail}
                        Button={Button}
                        cognitoSignIn={cognitoSignIn}
                        SpinnerSmallLoader={SpinnerSmallLoader}
                        FormControl={FormControl}
                        labels={labels}
                        primaryText={PLEASE_CONFIRM_PASSWORD_ENABLE_2FA}
                    />
                );

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
                        setShowDialog={setShowDialog}
                        ADD_RECOVERY_EMAIL={ADD_RECOVERY_EMAIL}
                        LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP={
                            LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP
                        }
                        SKIP={SKIP}
                        VERIFY={VERIFY}
                        RECOVERY_EMAIL_MANDATORY={RECOVERY_EMAIL_MANDATORY}
                        NOT_VALID_EMAIL={NOT_VALID_EMAIL}
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
                                onSetupClose();
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
                        setShowDialog={setShowDialog}
                    />
                );
            default:
                return <></>;
        }
    };

    return (
        <>
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
        </>
    );
};

MfaSetupFlow.propTypes = {
    userEmail: PropTypes.string.isRequired,
    isMfaEnabled: PropTypes.bool.isRequired,
    recoveryEmail: PropTypes.string.isRequired,

    onSetupClose: PropTypes.func.isRequired,

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
    TotpVerificationSignIn: PropTypes.func.isRequired,
    verifyTotpSetupCode: PropTypes.func.isRequired,
    cognitoSignIn: PropTypes.func.isRequired,
    generateMfaQrLink: PropTypes.func.isRequired,
    verifyEmailOtp: PropTypes.func.isRequired,
    generateEmailOtp: PropTypes.func.isRequired,

    // try to remove this
    SPModal: PropTypes.elementType.isRequired,
    // inside
    DiscardMessage: PropTypes.elementType.isRequired,

    SpinnerSmallLoader: PropTypes.elementType,
    FormControl: PropTypes.elementType,
    Button: PropTypes.elementType.isRequired,

    // HOC Props
    showDialog: PropTypes.bool,
    setShowDialog: PropTypes.func.isRequired,
    cancelNavigation: PropTypes.func.isRequired,
    confirmNavigation: PropTypes.func.isRequired,

    labels: PropTypes.shape({
        CONFIRM_PASSWORD: PropTypes.string.isRequired,
        CONFIRM: PropTypes.string.isRequired,
        PLEASE_CONFIRM_PASSWORD_ENABLE_2FA: PropTypes.string.isRequired,
        TWO_FACTOR_AUTHENTICATOR_2FA: PropTypes.string.isRequired,
        SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP: PropTypes.string.isRequired,
        USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR:
            PropTypes.string.isRequired,
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
        NOT_VALID_EMAIL: PropTypes.string.isRequired,
    }).isRequired,
};

MfaSetupFlow.defaultProps = {
    FormControl: FormControl,
    setupNewAuthenticator: false,
    setupNewAuthenticatorSuccess: () => {},
    onlyVerifyEmail: false,
    isRecoveryEmailMandatory: true,
    onlyVerifyCode: false,
    onlyVerifyCodeSuccess: () => {},
    SpinnerSmallLoader: SpinnerSmallLoader,
    Button: Button,
};

export default MfaSetupFlow;
