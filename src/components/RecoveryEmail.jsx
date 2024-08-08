import React, { useEffect, useRef, useState } from 'react';
import mfaRecoveryEmailValidator from './functions/mfaRecoveryEmailValidator';

const RecoveryEmail = ({
    userEmail,
    skip,
    onComplete,
    isOwner,
    Button,
    FormControl,
    emailTester,
    DisplayText,
    getLocalizeText,
}) => {
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryEmailError, setRecoveryEmailError] = useState('');
    const recoveryEmailInputRef = useRef(null);

    const handleRecoveryEmailChange = (e) => {
        setRecoveryEmailError('');
        setRecoveryEmail(e.target.value.trim());
    };

    useEffect(() => {
        console.log('recoverEmail changed');
        if (!recoveryEmail) return setRecoveryEmailError('');

        const error = mfaRecoveryEmailValidator(
            recoveryEmail,
            userEmail,
            false,
            emailTester,
            DisplayText,
            getLocalizeText
        );
        console.log({ error });
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
                        <h3 className="mfa-qr-text">Add Recovery e-mail</h3>
                        <h5 className="mfa-recovery-text-secondary mb-2">
                            If you lose access to your authenticator you can use
                            this e-mail as backup for login. Recovery e-mail and
                            login e-mail cannot be the same.
                        </h5>
                        <div className="form-group">
                            <FormControl
                                type="email"
                                id="mfa-recovery-email"
                                ref={recoveryEmailInputRef}
                                hasError={recoveryEmailError}
                                labelText={'recoveryEmail'}
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
                                Skip
                            </a>
                        )}

                        <Button
                            bsClass="btn btn-primary btn-medium"
                            disabled={!!isBtnDisabled}
                            variant="primary"
                            onClick={() => onComplete(recoveryEmail)}
                        >
                            Verify
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecoveryEmail;
