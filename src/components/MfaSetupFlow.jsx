import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import RecoveryEmail from './RecoveryEmail.jsx';
import QRScreen from './QRScreen.jsx';
import ConfirmPassword from './ConfirmPassword.jsx';
import OtpVerification from './OtpVerification.jsx';

import EmailOtpLock from '../commonComponents/emailOtpLockIcon.js';
import MfaOtpLockIcon from '../commonComponents/mfaOtpLockIcon.js';
import FormControl from '../commonComponents/FormControl.js';
import SpinnerSmallLoader from '../commonComponents/SpinnerSmallLoader.js';
import Button from '../commonComponents/Button.jsx';

const MfaSetupFlow = forwardRef(
    (
        {
            userEmail,
            isMfaEnabled,
            recoveryEmail,

            onSetupClose,
            setModalConfig,

            onMfaEnableStepComplete,
            onRecoveryEmailEnableStepComplete,

            // settings
            isRecoveryEmailMandatory,
            onlyVerifyEmail,
            setupNewAuthenticator,
            setupNewAuthenticatorSuccess,
            showSetupCompleteLoader,
            isSetupCompleteApiLoading,

            // apis
            TotpVerificationSignIn,
            generateMfaQrLink,
            verifyTotpSetupCode,
            cognitoSignIn,
            verifyEmailOtp,
            generateEmailOtp,

            // optional components
            FormControl,
            Button,
            SpinnerSmallLoader,

            //HOC props
            setShowDialog,
            confirmNavigation,

            // labels
            labels,
        },
        ref
    ) => {
        //  if onlyVerifyEmail is true, then skip password confirmation step and show email-verification step. in all other scenarios, password confirmation is mandatory.
        const initialStep = onlyVerifyEmail
            ? 'RECOVERY_EMAIL_OTP_VERIFICATION'
            : 'CONFIRM_PASSWORD';
        const [modalStep, setModalStep] = useState(initialStep);

        const [isAuthenticatorOtpVerified, setIsAuthenticatorOtpVerified] =
            useState(false);
        const [isMailOtpVerified, setIsMailOtpVerified] = useState(false);

        const recoveryEmailRef = useRef('');

        // verify totp code
        const handleVerifyOtp = (code) => {
            if (!isMfaEnabled || setupNewAuthenticator) {
                // configuring mfa first time or setting-up new authenticator
                return verifyTotpSetupCode(code);
            }
            return TotpVerificationSignIn(code);
        };

        const handleOtpVerificationComplete = async () => {
            if (setupNewAuthenticator && recoveryEmail) {
                // user wanted to setup new authenticator and has recovery email, so no need to show email-verification step and directly complete the setup.
                setupNewAuthenticatorSuccess();
                onSetupClose();
                return;
            }

            setModalStep('RECOVERY_EMAIL');
        };

        // if onlyVerifyEmail is true, then use the recoveryEmail prop, else use the recoveryEmailRef set from RecoveryEmail component.
        const recipientEmail = onlyVerifyEmail
            ? recoveryEmail
            : recoveryEmailRef && recoveryEmailRef.current;

        const handleGenerateEmailOtp = () => {
            generateEmailOtp(recipientEmail);
        };

        const handleVerifyEmailOtp = (code) => {
            return verifyEmailOtp(code, recipientEmail);
        };

        const handleEmailOtpVerificationComplete = () => {
            onRecoveryEmailEnableStepComplete(recipientEmail);

            if (!showSetupCompleteLoader) {
                onSetupClose();
            }
        };

        const {
            CONFIRM_PASSWORD,
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
            RECOVERY_EMAIL_MANDATORY,
            NOT_VALID_EMAIL,
            RECOVERY_EMAIL_CAN_NOT_BE_SAME_AS_LOGIN_EMAIL,
            ENTER_EMAIL_HERE,
        } = labels;

        // Modal close handler
        const handleCloseModal = () => {
            if (
                modalStep === 'OTP_VERIFICATION' ||
                modalStep === 'RECOVERY_EMAIL_OTP_VERIFICATION'
            ) {
                setShowDialog(true, true);
                return;
            }

            if (modalStep === 'RECOVERY_EMAIL') {
                if (isRecoveryEmailMandatory) {
                    // If recovery email is mandatory, show a confirmation dialog before allowing the user to close the modal.
                    setShowDialog(true, true);
                    return;
                }

                // If a new authenticator is being set up and adding a recovery email is optional.
                // complete the setup process and close the modal.
                if (setupNewAuthenticator) {
                    setupNewAuthenticatorSuccess();
                    onSetupClose();
                    return;
                }

                // If adding a recovery email is optional, mark the MFA enable step as complete and close the modal.
                onMfaEnableStepComplete();
                onSetupClose();
                return;
            }

            onSetupClose();
        };

        // Discard popup handler
        const handleDiscardPopup = () => {
            setShowDialog(false);
            confirmNavigation();
            onSetupClose();

            if (isMailOtpVerified) {
                // If the email OTP is verified (recoveryEmail verified) means User is in last step (RECOVERY_EMAIL_OTP_VERIFICATION)
                onRecoveryEmailEnableStepComplete(recoveryEmailRef.current);
            } else if (isRecoveryEmailMandatory) {
                // User hasn't verified email OTP and recovery email is mandatory, do nothing
                return;
            } else if (isAuthenticatorOtpVerified) {
                // User has verified authenticator OTP
                if (setupNewAuthenticator) {
                    // User is setting up a new authenticator
                    setupNewAuthenticatorSuccess();
                } else {
                    // User is completing MFA enable step
                    onMfaEnableStepComplete();
                }
            }
        };

        // expose functions to parent component
        useImperativeHandle(ref, () => ({
            handleCloseModal,
            handleDiscardPopup,
        }));

        const getModalContent = () => {
            switch (modalStep) {
                case 'CONFIRM_PASSWORD':
                    return (
                        <ConfirmPassword
                            onPasswordConfirm={() => setModalStep('QR_SCREEN')}
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
                            next={() => setModalStep('OTP_VERIFICATION')}
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
                            secondaryText={
                                ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR
                            }
                            Icon={MfaOtpLockIcon}
                            secondaryButtonText={BACK}
                            goBack={() => setModalStep('QR_SCREEN')}
                            primaryButtonText={NEXT}
                            verifyOtp={handleVerifyOtp}
                            successMessage={CODE_IS_VERIFIED}
                            codeInvalidMessage={CODE_IS_INVALID}
                            onComplete={handleOtpVerificationComplete}
                            isOtpVerified={isAuthenticatorOtpVerified}
                            setIsOtpVerified={setIsAuthenticatorOtpVerified}
                            Button={Button}
                            SpinnerSmallLoader={SpinnerSmallLoader}
                            setShowDialog={setShowDialog}
                            RESEND_CODE={RESEND_CODE}
                        />
                    );

                case 'RECOVERY_EMAIL':
                    return (
                        <RecoveryEmail
                            userEmail={userEmail}
                            skip={() => {
                                onMfaEnableStepComplete();
                                onSetupClose();
                            }}
                            onComplete={(recoveryEmail) => {
                                recoveryEmailRef.current = recoveryEmail;
                                setModalStep('RECOVERY_EMAIL_OTP_VERIFICATION');
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
                            RECOVERY_EMAIL_CAN_NOT_BE_SAME_AS_LOGIN_EMAIL={
                                RECOVERY_EMAIL_CAN_NOT_BE_SAME_AS_LOGIN_EMAIL
                            }
                            ENTER_EMAIL_HERE={ENTER_EMAIL_HERE}
                        />
                    );

                case 'RECOVERY_EMAIL_OTP_VERIFICATION':
                    return (
                        <OtpVerification
                            length={6}
                            isMfaEnabled={isMfaEnabled}
                            primaryText={ENTER_VERIFICATION_CODE_SENT_EMAIL}
                            secondaryText={
                                ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL
                            }
                            Icon={EmailOtpLock}
                            secondaryButtonText={BACK}
                            goBack={() => {
                                if (onlyVerifyEmail) {
                                    onSetupClose();
                                    return;
                                }
                                setModalStep('RECOVERY_EMAIL');
                            }}
                            primaryButtonText={FINISH}
                            verifyOtp={handleVerifyEmailOtp}
                            successMessage={RECOVERY_EMAIL_HAS_BEEN_VERIFIED}
                            codeInvalidMessage={CODE_HAS_EXPIRED}
                            onComplete={handleEmailOtpVerificationComplete}
                            isOtpVerified={isMailOtpVerified}
                            setIsOtpVerified={setIsMailOtpVerified}
                            showResendOption
                            resendOtp={handleGenerateEmailOtp}
                            Button={Button}
                            SpinnerSmallLoader={SpinnerSmallLoader}
                            setShowDialog={setShowDialog}
                            RESEND_CODE={RESEND_CODE}
                            isSetupCompleteApiLoading={
                                isSetupCompleteApiLoading
                            }
                        />
                    );
                default:
                    return <></>;
            }
        };

        useEffect(() => {
            if (modalStep === 'CONFIRM_PASSWORD') {
                setModalConfig({
                    title: CONFIRM_PASSWORD,
                    dimensions: { width: '442px', height: 'auto' },
                    css: 'popup-bg mfa-password-modal',
                });
            } else {
                setModalConfig({
                    title: TWO_FACTOR_AUTHENTICATOR_2FA,
                    dimensions: { width: '678px', height: '468px' },
                    css: 'popup-bg mfa-main-modal',
                });
            }
        }, [modalStep]);

        return <>{getModalContent()}</>;
    }
);

MfaSetupFlow.propTypes = {
    userEmail: PropTypes.string.isRequired,
    isMfaEnabled: PropTypes.bool.isRequired,
    recoveryEmail: PropTypes.string.isRequired,

    onSetupClose: PropTypes.func.isRequired,
    setModalConfig: PropTypes.func.isRequired,

    onMfaEnableStepComplete: PropTypes.func.isRequired,
    onRecoveryEmailEnableStepComplete: PropTypes.func.isRequired,

    // settings
    isRecoveryEmailMandatory: PropTypes.bool,
    setupNewAuthenticator: PropTypes.bool,
    setupNewAuthenticatorSuccess: PropTypes.func,
    onlyVerifyEmail: PropTypes.bool,
    showSetupCompleteLoader: PropTypes.bool,
    isSetupCompleteApiLoading: PropTypes.bool,

    // api
    TotpVerificationSignIn: PropTypes.func.isRequired,
    generateMfaQrLink: PropTypes.func.isRequired,
    verifyTotpSetupCode: PropTypes.func.isRequired,
    cognitoSignIn: PropTypes.func.isRequired,
    verifyEmailOtp: PropTypes.func.isRequired,
    generateEmailOtp: PropTypes.func.isRequired,

    // optional components
    FormControl: PropTypes.elementType,
    Button: PropTypes.elementType.isRequired,
    SpinnerSmallLoader: PropTypes.elementType,

    // HOC Props
    setShowDialog: PropTypes.func.isRequired,
    confirmNavigation: PropTypes.func.isRequired,

    labels: PropTypes.shape({
        CONFIRM: PropTypes.string,
        CONFIRM_PASSWORD: PropTypes.string,

        PLEASE_CONFIRM_PASSWORD_ENABLE_2FA: PropTypes.string,
        SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP: PropTypes.string,
        USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR: PropTypes.string,
        LEARN_MORE: PropTypes.string,
        NEXT: PropTypes.string,
        ADD_RECOVERY_EMAIL: PropTypes.string,
        LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: PropTypes.string,
        SKIP: PropTypes.string,
        VERIFY: PropTypes.string,
        RESEND_CODE: PropTypes.string,
        ENTER_VERIFICATION_CODE: PropTypes.string,
        ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR: PropTypes.string,
        BACK: PropTypes.string,
        FINISH: PropTypes.string,
        CODE_IS_VERIFIED: PropTypes.string,
        CODE_IS_INVALID: PropTypes.string,
        ENTER_VERIFICATION_CODE_SENT_EMAIL: PropTypes.string,
        ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL: PropTypes.string,
        RECOVERY_EMAIL_HAS_BEEN_VERIFIED: PropTypes.string,
        CODE_HAS_EXPIRED: PropTypes.string,
        RECOVERY_EMAIL_MANDATORY: PropTypes.string,
        NOT_VALID_EMAIL: PropTypes.string,
        RECOVERY_EMAIL_CAN_NOT_BE_SAME_AS_LOGIN_EMAIL: PropTypes.string,
        ENTER_EMAIL_HERE: PropTypes.string,
    }),
};

MfaSetupFlow.defaultProps = {
    FormControl: FormControl,
    setupNewAuthenticator: false,
    setupNewAuthenticatorSuccess: () => {},
    onlyVerifyEmail: false,
    isRecoveryEmailMandatory: true,
    SpinnerSmallLoader: SpinnerSmallLoader,
    Button: Button,
    showSetupCompleteLoader: false,
    isSetupCompleteApiLoading: false,
    labels: {
        CONFIRM: 'Confirm',
        CONFIRM_PASSWORD: 'Confirm Password',
        TWO_FACTOR_AUTHENTICATOR_2FA: 'Two Factor Authenticator (2FA)',
        PLEASE_CONFIRM_PASSWORD_ENABLE_2FA:
            'Please confirm your password to enable 2FA',
        SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP:
            'Scan using authenticator to link SocialPilot',
        USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR:
            'Use Google authenticator, Microsoft authenticator, Authy or Duo mobile',
        LEARN_MORE: 'Learn more',
        NEXT: 'Next',
        ADD_RECOVERY_EMAIL: 'Add Recovery e-mail',
        LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP:
            'If you lose access to your authenticator you can use this e-mail as backup for login. Recovery e-mail and login e-mail cannot be the same.',
        SKIP: 'Skip',
        VERIFY: 'Verify',
        RESEND_CODE: 'Resend Code',
        ENTER_VERIFICATION_CODE: 'Enter Verification Code',
        ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR:
            'Enter the 6 Digit code from authenticator.',
        BACK: 'Back',
        FINISH: 'Finish',
        CODE_IS_VERIFIED: 'Code is verified',
        CODE_IS_INVALID: 'Code is invalid',
        ENTER_VERIFICATION_CODE_SENT_EMAIL:
            'Enter Verification Code Sent to e-mail',
        ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL:
            'Enter the 6 Digit code sent to your recovery e-mail.',
        RECOVERY_EMAIL_HAS_BEEN_VERIFIED:
            'Recovery email has been verified successfully.',
        CODE_HAS_EXPIRED: 'Code has expired',
        RECOVERY_EMAIL_MANDATORY: 'Recovery email is mandatory',
        NOT_VALID_EMAIL: 'Please enter a valid email address.',
        RECOVERY_EMAIL_CAN_NOT_BE_SAME_AS_LOGIN_EMAIL:
            'Recovery email cannot be the same as login email.',
        ENTER_EMAIL_HERE: 'Enter e-mail here',
    },
};

export default MfaSetupFlow;
