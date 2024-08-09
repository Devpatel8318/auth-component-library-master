import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmPasswordModal from './ConfirmPasswordModal.jsx';
import MfaModal from './MfaModal.jsx';
import './index.scss';

const MfaSetupFlow = ({
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
    labels,
}) => {
    const [isPasswordConfirmed, setIsPasswordConfirmed] =
        useState(onlyVerifyEmail);
    const onPasswordConfirm = () => {
        setIsPasswordConfirmed(true);
    };

    return (
        <>
            {isPasswordConfirmed ? (
                <MfaModal
                    HOC={HOCUnsavePrompt}
                    closeModal={onCloseModal}
                    userEmail={userEmail}
                    isMfaEnabled={isMfaEnabled}
                    onMfaEnableStepComplete={onMfaEnableStepComplete}
                    onRecoveryEmailEnableStepComplete={
                        onRecoveryEmailEnableStepComplete
                    }
                    isOwner={isOwner}
                    onlyVerifyCode={onlyVerifyCode}
                    onlyVerifyCodeSuccess={onlyVerifyCodeSuccess}
                    setupNewAuthenticator={setupNewAuthenticator}
                    recoveryEmail={recoveryEmail}
                    setupNewAuthenticatorSuccess={setupNewAuthenticatorSuccess}
                    onlyVerifyEmail={onlyVerifyEmail}
                    showResendOption={showResendOption}
                    FormControl={FormControl}
                    generateMfaQrLink={generateMfaQrLink}
                    SPModal={SPModal}
                    Button={Button}
                    DiscardMessage={DiscardMessage}
                    TOTPVerificationSignIn={TOTPVerificationSignIn}
                    verifyTOTPSetupCode={verifyTOTPSetupCode}
                    callAPI={callAPI}
                    SpinnerSmallLoader={SpinnerSmallLoader}
                    API_AUTH_BASE_URL={API_AUTH_BASE_URL}
                    emailTester={emailTester}
                    EmailOtpLock={EmailOtpLock}
                    MfaOtpLockIcon={MfaOtpLockIcon}
                    HOCUnsavePrompt={HOCUnsavePrompt}
                    FormattedMessage={FormattedMessage}
                    recoveryEmailOtplength={recoveryEmailOtplength}
                    labels={labels}
                />
            ) : (
                <ConfirmPasswordModal
                    onCloseModal={onCloseModal}
                    onPasswordConfirm={onPasswordConfirm}
                    userEmail={userEmail}
                    SPModal={SPModal}
                    Button={Button}
                    cognitoSignIn={cognitoSignIn}
                    SpinnerSmallLoader={SpinnerSmallLoader}
                    FormControl={FormControl}
                    labels={labels}
                />
            )}
        </>
    );
};

MfaSetupFlow.propTypes = {
    userEmail: PropTypes.string.isRequired,
    isMfaEnabled: PropTypes.bool.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onMfaEnableStepComplete: PropTypes.func.isRequired,
    onRecoveryEmailEnableStepComplete: PropTypes.func.isRequired,
    isOwner: PropTypes.bool.isRequired,
    onlyVerifyCode: PropTypes.bool.isRequired,
    onlyVerifyCodeSuccess: PropTypes.bool.isRequired,
    setupNewAuthenticator: PropTypes.bool.isRequired,
    setupNewAuthenticatorSuccess: PropTypes.bool.isRequired,
    recoveryEmail: PropTypes.string.isRequired,
    onlyVerifyEmail: PropTypes.bool.isRequired,
    showResendOption: PropTypes.bool.isRequired,
    SPModal: PropTypes.elementType.isRequired,
    Button: PropTypes.elementType.isRequired,
    HOCUnsavePrompt: PropTypes.elementType.isRequired,
    DiscardMessage: PropTypes.elementType.isRequired,
    TOTPVerificationSignIn: PropTypes.func.isRequired,
    verifyTOTPSetupCode: PropTypes.func.isRequired,
    callAPI: PropTypes.func.isRequired,
    API_AUTH_BASE_URL: PropTypes.string.isRequired,
    emailTester: PropTypes.func.isRequired,
    SpinnerSmallLoader: PropTypes.elementType.isRequired,
    FormControl: PropTypes.elementType.isRequired,
    generateMfaQrLink: PropTypes.func.isRequired,
    MfaOtpLockIcon: PropTypes.node.isRequired,
    EmailOtpLock: PropTypes.node.isRequired,
    FormattedMessage: PropTypes.elementType.isRequired,
    cognitoSignIn: PropTypes.func.isRequired,
    recoveryEmailOtplength: PropTypes.number.isRequired,
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
        DISCARD_INVITE: PropTypes.string.isRequired,
        DISCARD_INVITE_CONFIRMATION: PropTypes.string.isRequired,
        RECOVERY_EMAIL_MANDATORY: PropTypes.string.isRequired,
        NOT_VALID_EMAIL: PropTypes.string.isRequired,
    }).isRequired,
};

export default MfaSetupFlow;
