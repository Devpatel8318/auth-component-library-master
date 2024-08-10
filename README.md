# dev-test-mfa

mfa flow

## Usage

All exported components are listed in src/index.js

```jsx
import React from 'react';

import { MfaSetupFlow } from 'dev-test-mfa';

const App = () => {
    return <MfaSetupFlow />;
};

export default App;
```

## License

<!-- MIT © [hinammehra](https://github.com/hinammehra) -->

## Props

userEmail (string):
The email of the user undergoing the MFA setup.

isMfaEnabled (bool):
A flag indicating whether MFA is already enabled for the user.

onCloseModal (func):
A callback function triggered when the modal is closed.

onMfaEnableStepComplete (func):
A callback function that is called when an MFA enable step is completed.

onRecoveryEmailEnableStepComplete (func):
A callback function triggered upon completion of the recovery email step.

isOwner (bool):
Indicates if the current user is the owner of the account.

onlyVerifyCode (bool):
If true, only the verification code will be processed.

onlyVerifyCodeSuccess (bool):
A flag indicating if the verification code was successfully processed.

setupNewAuthenticator (bool):
If true, initiates the setup of a new authenticator.

setupNewAuthenticatorSuccess (bool):
Indicates whether the new authenticator setup was successful.

recoveryEmail (string):
The user's recovery email address.

onlyVerifyEmail (bool):
If true, only the email verification process will occur.

showResendOption (bool):
Determines whether to display the option to resend the verification code.

SPModal (elementType):
A React component used to render the modal.

Button (elementType):
A React component used to render buttons within the modal.

HOCUnsavePrompt (elementType):
A Higher Order Component (HOC) used to prompt the user when they attempt to navigate away with unsaved changes.

DiscardMessage (elementType):
A React component used to display discard confirmation messages.

TOTPVerificationSignIn (func):
A function for signing in via TOTP (Time-based One-Time Password) verification.

verifyTOTPSetupCode (func):
A function for verifying the TOTP setup code.

callAPI (func):
A function used to make API calls necessary during the MFA setup.

API_AUTH_BASE_URL (string):
The base URL for the authentication API.

emailTester (func):
A function used to validate email formats.

SpinnerSmallLoader (elementType):
A React component used to display a small loading spinner.

FormControl (elementType):
A React component used to control forms.

generateMfaQrLink (func):
A function that generates a QR code link for MFA setup.

MfaOtpLockIcon (node):
A React node representing the OTP lock icon.

EmailOtpLock (node):
A React node representing the email OTP lock icon.

FormattedMessage (elementType):
A React component used to display formatted messages (e.g., localization).

cognitoSignIn (func):
A function that handles the sign-in process via AWS Cognito.

recoveryEmailOtplength (number):
The length of the OTP sent to the recovery email.

### labels (shape):

An object containing various string labels used throughout the component. This object includes:

CONFIRM_PASSWORD,
CONFIRM,
PLEASE_CONFIRM_PASSWORD_ENABLE_2FA,
TWO_FACTOR_AUTHENTICATOR_2FA,
SCAN_QR_USING_AUTHENTICATOR_TO_LINK_SP,
USE_GOOGLE_MICROSOFT_AUTH_DUO_AUTHENTICATOR,
LEARN_MORE,
NEXT,
ADD_RECOVERY_EMAIL,
LOSE_ACCESS_AUTHENTICATOR_USE_EMAIL_BACKUP,
SKIP,
VERIFY,
RESEND_CODE,
ENTER_VERIFICATION_CODE,
ENTER_6_DIGIT_CODE_FROM_AUTHENTICATOR,
BACK,
FINISH,
CODE_IS_VERIFIED,
CODE_IS_INVALID,
ENTER_VERIFICATION_CODE_SENT_EMAIL,
ENTER_6_DIGIT_CODE_FROM_RECOVERY_EMAIL,
RECOVERY_EMAIL_HAS_BEEN_VERIFIED,
CODE_HAS_EXPIRED,
DISCARD,
SAVE,
DISCARD_INVITE,
DISCARD_INVITE_CONFIRMATION,
RECOVERY_EMAIL_MANDATORY,
NOT_VALID_EMAIL,
