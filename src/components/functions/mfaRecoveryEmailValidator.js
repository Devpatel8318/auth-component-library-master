const mfaRecoveryEmailValidator = (
    email,
    loginEmail,
    allowEmptyString = false,
    emailTester,
    DisplayText,
    getLocalizeText
) => {
    console.log('in mfaRecoveryEmailValidator');
    if (!email || !email.trim()) {
        return allowEmptyString
            ? ''
            : getLocalizeText(DisplayText.RECOVERY_EMAIL_MANDATORY);
    }

    if (!emailTester(email))
        return getLocalizeText(DisplayText.NOT_VALID_EMAIL);

    if (email === loginEmail) {
        return 'Recovery email cannot be same as login e-mail.';
    }

    return '';
};

export default mfaRecoveryEmailValidator;
