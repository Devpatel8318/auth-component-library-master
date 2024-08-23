export const emailTester = (email) => {
    // eslint-disable-next-line no-useless-escape
    const tester =
        /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email) return false;

    if (email.length > 254) return false;

    if (!tester.test(email)) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;
    if (parts[0].length > 64) return false;

    return true;
};

const mfaRecoveryEmailValidator = (
    email,
    loginEmail,
    allowEmptyString = false,
    RECOVERY_EMAIL_MANDATORY,
    NOT_VALID_EMAIL,
    RECOVERY_EMAIL_CAN_NOT_BE_SAME_AS_LOGIN_EMAIL
) => {
    if (!email || !email.trim()) {
        return allowEmptyString ? '' : RECOVERY_EMAIL_MANDATORY;
    }

    if (!emailTester(email)) return NOT_VALID_EMAIL;

    if (email.toLowerCase() === loginEmail) {
        return RECOVERY_EMAIL_CAN_NOT_BE_SAME_AS_LOGIN_EMAIL;
    }

    return '';
};

export default mfaRecoveryEmailValidator;
