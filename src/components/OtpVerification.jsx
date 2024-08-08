import React, { useState } from 'react';
import OtpInput from './OtpInput.jsx';

const OtpVerification = ({
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
}) => {
    const [OTP, setOTP] = useState(Array(length).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (code) => {
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

    return (
        <div className="row mfa-qr">
            <div className="col-lg-12 d-flex flex-column justify-content-between">
                <div className="row justify-content-center">
                    <div className="col-lg-12 text-center mt-2 mfa-qr-container p-0">
                        <div className="row flex-column justify-content-center">
                            <div className="col-lg-12 mb-2">{Icon}</div>
                            <div className="col-lg-12 mb-2">
                                <h3 className="mfa-otp-text mb-8">
                                    {primaryText}
                                </h3>
                                <p className="mb-0 text-grey">
                                    {secondaryText}
                                </p>
                            </div>
                            <div className="col-lg-12 mb-1 position-relative">
                                <OtpInput
                                    length={length}
                                    OTP={OTP}
                                    setOTP={setOTP}
                                    isLoading={isLoading}
                                    setIsLoading={setIsLoading}
                                    errorMessage={errorMessage}
                                    setErrorMessage={setErrorMessage}
                                    handleSubmit={handleSubmit}
                                />
                                {isLoading && (
                                    <div className="mt-8 mfa-otp-spinner-loader">
                                        <SpinnerSmallLoader className="circular-spinner mr-8" />
                                    </div>
                                )}
                            </div>
                            <div className="col-lg-12">
                                {errorMessage && (
                                    <div className="text-danger mfa-otp-message-text">
                                        {errorMessage}{' '}
                                        {showResendOption ? (
                                            <a
                                                className="delete-group"
                                                href="javascript:;"
                                                onClick={resendOtp}
                                            >
                                                Resend code
                                            </a>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}
                                {!isLoading &&
                                    !errorMessage &&
                                    OTP.every((digit) => digit !== '') && (
                                        <div className="text-success mfa-otp-message-text">
                                            {successMessage}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <a
                                className=""
                                href="javascript:;"
                                onClick={goBack}
                            >
                                {secondaryButtonText}
                            </a>

                            <Button
                                bsClass="btn btn-primary btn-medium ml-2"
                                disabled={!isOtpVerified}
                                variant="primary"
                                onClick={onComplete}
                            >
                                {primaryButtonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
