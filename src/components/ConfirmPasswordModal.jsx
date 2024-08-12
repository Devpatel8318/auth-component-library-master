import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormControl from '../sharedComponents/FormControl';

const ConfirmPasswordModal = ({
    onCloseModal,
    onPasswordConfirm,
    userEmail,
    SPModal,
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

    const { CONFIRM_PASSWORD, CONFIRM } = labels;

    return (
        <SPModal
            showModal
            onCloseModal={onCloseModal}
            closeOnOverlayClick={false}
            closeIcon
            closeOnEsc
            title={CONFIRM_PASSWORD}
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
                                disabled={isLoading}
                                variant="primary"
                                type="submit"
                            >
                                {CONFIRM}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </SPModal>
    );
};

ConfirmPasswordModal.propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onPasswordConfirm: PropTypes.func.isRequired,
    userEmail: PropTypes.string.isRequired,
    SPModal: PropTypes.elementType.isRequired,
    Button: PropTypes.elementType.isRequired,
    cognitoSignIn: PropTypes.func.isRequired,
    SpinnerSmallLoader: PropTypes.elementType.isRequired,
    FormControl: PropTypes.elementType,
    labels: PropTypes.shape({
        CONFIRM_PASSWORD: PropTypes.string.isRequired,
        CONFIRM: PropTypes.string.isRequired,
        PLEASE_CONFIRM_PASSWORD_ENABLE_2FA: PropTypes.string.isRequired,
    }).isRequired,
};

ConfirmPasswordModal.defaultProps = {
    FormControl: FormControl,
};

export default ConfirmPasswordModal;
