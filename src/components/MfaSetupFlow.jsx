import React, { useState } from 'react';
import ConfirmPasswordModal from './ConfirmPasswordModal.jsx';
import MfaModal from './MfaModal.jsx';

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
    // new props
    SPModal,
    Button,
    HOCUnsavePrompt,
    DiscardMessage,
    DisplayText,
    getLocalizeText,
    GlobalDisplayTexts,
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
    sharedDisplayText,
    FormattedMessage,
    cognitoSignIn,
}) => {
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(true);
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
                    sharedDisplayText={sharedDisplayText}
                    FormControl={FormControl}
                    generateMfaQrLink={generateMfaQrLink}
                    SPModal={SPModal}
                    Button={Button}
                    DiscardMessage={DiscardMessage}
                    DisplayText={DisplayText}
                    getLocalizeText={getLocalizeText}
                    GlobalDisplayTexts={GlobalDisplayTexts}
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
                />
            ) : (
                <ConfirmPasswordModal
                    onCloseModal={onCloseModal}
                    onPasswordConfirm={onPasswordConfirm}
                    userEmail={userEmail}
                    primaryText="Please confirm your password to enable 2FA"
                    SPModal={SPModal}
                    Button={Button}
                    cognitoSignIn={cognitoSignIn}
                    SpinnerSmallLoader={SpinnerSmallLoader}
                    FormControl={FormControl}
                />
            )}
        </>
    );
};

export default MfaSetupFlow;
