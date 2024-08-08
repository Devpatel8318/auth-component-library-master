import React, { useState } from 'react';
import { OtpInput } from 'dev-test-mfa';

function Test() {
    let length = 6;
    const [OTP, setOTP] = useState(Array(length).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    return (
        <>
            <OtpInput
                length={length}
                OTP={OTP}
                setOTP={setOTP}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                handleSubmit={() => {}}
            />
        </>
    );
}

export default Test;
