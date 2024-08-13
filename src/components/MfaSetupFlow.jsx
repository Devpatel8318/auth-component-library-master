import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmPasswordModal from './ConfirmPasswordModal.jsx';
import MfaModal from './MfaModal.jsx';
import './index.scss';
import FormControl from '../sharedComponents/FormControl.js';
import SpinnerSmallLoader from '../sharedComponents/SpinnerSmallLoader.js';
import Button from '../sharedComponents/Button.jsx';

const MfaSetupFlow = ({
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
}) => {
    const [isPasswordConfirmed, setIsPasswordConfirmed] =
        useState(onlyVerifyEmail);
    const onPasswordConfirm = () => {
        setIsPasswordConfirmed(true);
    };

    const { PLEASE_CONFIRM_PASSWORD_ENABLE_2FA } = labels;

    return (
        <>
            {isPasswordConfirmed ? (
                <MfaModal
                    closeModal={onCloseModal}
                    userEmail={userEmail}
                    isMfaEnabled={isMfaEnabled}
                    onMfaEnableStepComplete={onMfaEnableStepComplete}
                    onRecoveryEmailEnableStepComplete={
                        onRecoveryEmailEnableStepComplete
                    }
                    isRecoveryEmailMandatory={isRecoveryEmailMandatory}
                    onlyVerifyCode={onlyVerifyCode}
                    onlyVerifyCodeSuccess={onlyVerifyCodeSuccess}
                    setupNewAuthenticator={setupNewAuthenticator}
                    recoveryEmail={recoveryEmail}
                    setupNewAuthenticatorSuccess={setupNewAuthenticatorSuccess}
                    onlyVerifyEmail={onlyVerifyEmail}
                    FormControl={FormControl}
                    generateMfaQrLink={generateMfaQrLink}
                    SPModal={SPModal}
                    Button={Button}
                    DiscardMessage={DiscardMessage}
                    TotpVerificationSignIn={TotpVerificationSignIn}
                    verifyTotpSetupCode={verifyTotpSetupCode}
                    SpinnerSmallLoader={SpinnerSmallLoader}
                    labels={labels}
                    verifyEmailOtp={verifyEmailOtp}
                    generateEmailOtp={generateEmailOtp}
                    showDialog={showDialog}
                    setShowDialog={setShowDialog}
                    cancelNavigation={cancelNavigation}
                    confirmNavigation={confirmNavigation}
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
                    primaryText={PLEASE_CONFIRM_PASSWORD_ENABLE_2FA}
                />
            )}
        </>
    );
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
