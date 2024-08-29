import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import FormControl from '../commonComponents/FormControl';
import Button from '../commonComponents/Button.jsx';
import SpinnerSmallLoader from '../commonComponents/SpinnerSmallLoader';

const ConfirmPassword = ({
    onPasswordConfirm,
    userEmail,
    Button,
    cognitoSignIn,
    SpinnerSmallLoader,
    FormControl,
    labels,
    primaryText,
}) => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const passwordInputRef = useRef(null);

    const handlePasswordChange = (e) => {
        setPasswordError('');
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setPasswordError('');
        const { success, error } = await cognitoSignIn(
            userEmail,
            password,
            1,
            true
        );
        setIsLoading(false);

        if (error) {
            setPasswordError(error);
            setPassword('')
        }

        if (success) {
            onPasswordConfirm();
        }
    };

    const { CONFIRM } = labels;

    useEffect(() => {
        if (passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="row">
            <div className="col-lg-12">
                <div className="row mb-40">
                    <div className="col-lg-12 text-center">
                        <h5 className="mfa-password-text mb-8 text-grey mt-0">
                            {primaryText}
                        </h5>
                        <h3 className="mfa-password-email mb-2 mt-0">
                            {userEmail}
                        </h3>
                        <div className="form-group mb-0 position-relative">
                            <FormControl
                                type="password"
                                id="mfa-confirm-password"
                                ref={passwordInputRef}
                                hasError={passwordError}
                                errorMessage={passwordError}
                                name="confirmPassword"
                                value={password}
                                onChange={handlePasswordChange}
                                bsClass={`text-center mfa-password-input-box`}
                                autoFocus
                            />
                            <div
                                className={`invalid-feedback ${
                                    passwordError ? 'd-block' : ''
                                }`}
                            >
                                {passwordError}
                            </div>
                            {isLoading && (
                                <div className="mt-1 input-spinner-loader">
                                    <SpinnerSmallLoader className="circular-spinner mr-8" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <Button
                            bsClass="btn btn-primary btn-medium"
                            disabled={isLoading || password === ""}
                            variant="primary"
                            type="submit"
                        >
                            {CONFIRM}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

ConfirmPassword.propTypes = {
    onPasswordConfirm: PropTypes.func.isRequired,
    userEmail: PropTypes.string.isRequired,
    Button: PropTypes.elementType,
    cognitoSignIn: PropTypes.func.isRequired,
    SpinnerSmallLoader: PropTypes.elementType,
    FormControl: PropTypes.elementType,
    labels: PropTypes.shape({
        CONFIRM: PropTypes.string,
    }),
};

ConfirmPassword.defaultProps = {
    FormControl: FormControl,
    Button: Button,
    SpinnerSmallLoader: SpinnerSmallLoader,
    labels: {
        CONFIRM: 'Confirm',
    },
};

export default ConfirmPassword;
