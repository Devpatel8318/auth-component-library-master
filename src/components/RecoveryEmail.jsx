import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import mfaRecoveryEmailValidator from '../utils/mfaRecoveryEmailValidator';

const RecoveryEmail = ({
    userEmail,
    skip,
    onComplete,
    isOwner,
    Button,
    FormControl,
    emailTester,
    ADD_RECOVERY_EMAIL,
    LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP,
    SKIP,
    VERIFY,
    RECOVERY_EMAIL_MANDATORY,
    NOT_VALID_EMAIL,
}) => {
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryEmailError, setRecoveryEmailError] = useState('');
    const recoveryEmailInputRef = useRef(null);

    const handleRecoveryEmailChange = (e) => {
        setRecoveryEmailError('');
        setRecoveryEmail(e.target.value.trim());
    };

    useEffect(() => {
        if (!recoveryEmail) return setRecoveryEmailError('');

        const error = mfaRecoveryEmailValidator(
            recoveryEmail,
            userEmail,
            false,
            emailTester,
            RECOVERY_EMAIL_MANDATORY,
            NOT_VALID_EMAIL
        );
        if (error) {
            setRecoveryEmailError(error);
        }
    }, [recoveryEmail]);

    useEffect(() => {
        if (recoveryEmailInputRef.current) {
            recoveryEmailInputRef.current.focus();
        }
    }, []);

    const isBtnDisabled =
        !recoveryEmail.length || (recoveryEmail.length && recoveryEmailError);

    return (
        <div className="row mfa-qr">
            <div className="col-lg-12 d-flex flex-column justify-content-between">
                <div className="row justify-content-center">
                    <div className="col text-center mt-2 mfa-recovery-container p-0">
                        <h3 className="mfa-qr-text">{ADD_RECOVERY_EMAIL}</h3>
                        <h5 className="mfa-recovery-text-secondary mb-2">
                            {LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP}
                        </h5>
                        <div className="form-group">
                            <FormControl
                                type="email"
                                id="mfa-recovery-email"
                                ref={recoveryEmailInputRef}
                                hasError={recoveryEmailError}
                                errorMessage={recoveryEmailError}
                                name="recoveryEmail"
                                value={recoveryEmail}
                                onChange={handleRecoveryEmailChange}
                                bsClass={`text-center mfa-password-input-box`}
                            />
                            <div
                                className={`invalid-feedback ${
                                    recoveryEmailError ? 'd-block' : ''
                                }`}
                            >
                                {recoveryEmailError}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-end">
                        {!isOwner && (
                            <a
                                className="delete-group btn-medium"
                                href="javascript:;"
                                onClick={skip}
                            >
                                {SKIP}
                            </a>
                        )}

                        <Button
                            bsClass="btn btn-primary btn-medium"
                            disabled={!!isBtnDisabled}
                            variant="primary"
                            onClick={() => onComplete(recoveryEmail)}
                        >
                            {VERIFY}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

RecoveryEmail.propTypes = {
    userEmail: PropTypes.string.isRequired,
    skip: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    isOwner: PropTypes.bool.isRequired,
    Button: PropTypes.elementType.isRequired,
    FormControl: PropTypes.elementType.isRequired,
    emailTester: PropTypes.func.isRequired,
    ADD_RECOVERY_EMAIL: PropTypes.string.isRequired,
    LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP: PropTypes.string.isRequired,
    SKIP: PropTypes.string.isRequired,
    VERIFY: PropTypes.string.isRequired,
    RECOVERY_EMAIL_MANDATORY: PropTypes.string.isRequired,
    NOT_VALID_EMAIL: PropTypes.string.isRequired,
};

export default RecoveryEmail;
