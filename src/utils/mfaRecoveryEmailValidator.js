const mfaRecoveryEmailValidator = (
    email,
    loginEmail,
    allowEmptyString = false,
    emailTester,
    RECOVERY_EMAIL_MANDATORY,
    NOT_VALID_EMAIL
) => {
    if (!email || !email.trim()) {
        return allowEmptyString ? '' : RECOVERY_EMAIL_MANDATORY;
    }

    if (!emailTester(email)) return NOT_VALID_EMAIL;

    if (email === loginEmail) {
        return 'Recovery email cannot be same as login e-mail.';
    }

    return '';
};

export default mfaRecoveryEmailValidator;
