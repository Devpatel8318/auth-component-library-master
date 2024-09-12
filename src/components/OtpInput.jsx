import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const OtpInput = ({
    length,
    OTP,
    setOTP,
    isLoading,
    errorMessage,
    setErrorMessage,
    handleSubmit,
    customCss,
    disabled,
}) => {
    const inputRef = useRef(Array(length).fill(null));
    const [lastInputIndex, setLastInputIndex] = useState(null);

    const handleTextChange = async (input, index) => {
        if (!/^\d*$/.test(input)) return; // only numeric input

        const newOtp = [...OTP];
        newOtp[index] = input;
        setOTP(newOtp);

        if (input && index < length - 1) {
            // not on last input box
            if (inputRef.current[index + 1]) {
                inputRef.current[index + 1].focus(); // focus to next input box
            }
        }

        if (newOtp.every((digit) => digit !== '')) {
            // all input boxes are filled
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
                // not on first input box and current input box is empty -> then focus to previous input box
                if (inputRef.current[index - 1]) {
                    inputRef.current[index - 1].focus();
                }
            } else {
                // current input box is not empty -> clear the input box
                const newPin = [...OTP];
                newPin[index] = '';
                setOTP(newPin);
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData('text')
            .slice(0, length)
            .split('');

        const newOTP = [...OTP];
        pasteData.forEach((char, index) => {
            if (/^\d$/.test(char)) {
                newOTP[index] = char;
            }
        });

        setOTP(newOTP);

        if (newOTP.every((digit) => digit !== '')) {
            handleSubmit(newOTP.join(''));
        }
    };

    useEffect(() => {
        if (
            !isLoading &&
            lastInputIndex !== null &&
            inputRef.current[lastInputIndex]
        ) {
            inputRef.current[lastInputIndex].focus();
        }
    }, [isLoading, lastInputIndex]);

    useEffect(() => {
        inputRef.current[0].focus();
    }, []);

    return (
        <div
            className={customCss || 'd-flex justify-content-start w-100'}
            onPaste={handlePaste}
        >
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={OTP[index]}
                    disabled={disabled}
                    onChange={(e) => handleTextChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(ref) => {
                        inputRef.current[index] = ref;
                    }}
                    className={`mfa-otp-input ${
                        errorMessage ? 'mfa-otp-input-invalid' : ''
                    }`}
                />
            ))}
        </div>
    );
};

OtpInput.propTypes = {
    length: PropTypes.number,
    OTP: PropTypes.arrayOf(PropTypes.string).isRequired,
    setOTP: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    errorMessage: PropTypes.string,
    setErrorMessage: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    customCss: PropTypes.string,
    disabled: PropTypes.bool,
};

OtpInput.defaultProps = {
    length: 6,
    isLoading: false,
    errorMessage: '',
    customCss: '',
    disabled: false,
};

export default OtpInput;
