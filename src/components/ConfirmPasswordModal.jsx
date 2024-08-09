import React, { useState, useRef, useEffect } from 'react';

const ConfirmPasswordModal = ({
    onCloseModal,
    onPasswordConfirm,
    userEmail,
    primaryText,
    SPModal,
    Button,
    cognitoSignIn,
    SpinnerSmallLoader,
    FormControl,
}) => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const passwordInputRef = useRef(null);

    useEffect(() => {
        if (passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    }, []);

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
        }

        if (success) {
            onPasswordConfirm();
        }
    };

    return (
        <SPModal
            showModal
            onCloseModal={onCloseModal}
            closeOnOverlayClick={false}
            closeIcon
            closeOnEsc
            title="Confirm Password"
            classNames={{ modal: 'popup-bg mfa-password-modal' }}
            styles={{ modal: { width: '442px' } }}
        >
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
                                    labelText={'password'}
                                    errorMessage={passwordError}
                                    name="confirmPassword"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    bsClass={`text-center mfa-password-input-box`}
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
                                disabled={isLoading}
                                variant="primary"
                                type="submit"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </SPModal>
    );
};

export default ConfirmPasswordModal;
