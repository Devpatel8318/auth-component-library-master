import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

function HelloWorld() {
  return /*#__PURE__*/React.createElement("h1", null, "Hello World 1234");
}

// import generateMfaQrLink from 'services/cognito/generateMfaQrLink';
// import Button from 'sharedComponents/pureComponent(stateless)/Buttons/Button';

function QRScreen(_ref) {
  const [qrLink, setQRLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getQrLink = async () => {
      setIsLoading(true);
      // const qrLinkResponse = await generateMfaQrLink(
      //     'SocialPilot',
      //     userEmail
      // );
      const qrLinkResponse = {
        qrLink: 'otpauth://totp/socialPilot:DevPatel?secret=HYR2QAW…4JIY7OVGNT4RRHA7Z4SA5OUMRQU5WQ&issuer=socialPilot'
      };
      if (!qrLinkResponse.error) {
        const {
          qrLink
        } = qrLinkResponse;
        setQRLink(qrLink);
      }
      setIsLoading(false);
    };
    getQrLink();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "row mfa-qr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-12 text-center mt-2 mfa-qr-container p-0"
  }, isLoading ? /*#__PURE__*/React.createElement("div", {
    className: "qr-code-loader"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement(QRCode, {
    size: 200,
    value: qrLink
  })), /*#__PURE__*/React.createElement("h3", {
    className: "mfa-qr-text mt-0 mb-8"
  }, "Scan using authenticator to link SocialPilot"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-grey"
  }, "Use Google authenticator, Microsoft authenticator, Authy or Duo mobile", /*#__PURE__*/React.createElement("a", {
    href: "https://help.socialpilot.co/article/438-why-am-i-being-asked-to-re-connect-my-accounts#Account-disconnection-due-to-Missing-Roles-andor-Permissions-on-Faceb-VNHYK",
    target: "_blank",
    rel: "noopener noreferrer"
  }, ' ', "Learn more.")))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col d-flex justify-content-end"
  }, "Next"))));
}

export { HelloWorld, QRScreen };
