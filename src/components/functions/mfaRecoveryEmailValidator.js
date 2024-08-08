const mfaRecoveryEmailValidator = (
    email,
    loginEmail,
    allowEmptyString = false,
    emailTester,
    DisplayText,
    getLocalizeText
) => {
    console.log({
        email,
        loginEmail,
        allowEmptyString,
        emailTester,
        DisplayText,
        getLocalizeText,
    });
    if (!email || !email.trim()) {
        return allowEmptyString
            ? ''
            : getLocalizeText(DisplayText.RECOVERY_EMAIL_MANDATORY);
    }
    console.log('22');

    if (!emailTester(email))
        return getLocalizeText(DisplayText.NOT_VALID_EMAIL);

    console.log('26');

    if (email === loginEmail) {
        return 'Recovery email cannot be same as login e-mail.';
    }

    console.log('33');

    return '';
};

export default mfaRecoveryEmailValidator;
