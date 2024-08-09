import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

function QRScreen({ next, userEmail, Button, generateMfaQrLink }) {
    const [qrLink, setQRLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getQrLink = async () => {
            setIsLoading(true);
            const qrLinkResponse = await generateMfaQrLink(
                'SocialPilot',
                userEmail
            );
            if (!qrLinkResponse.error) {
                const { qrLink } = qrLinkResponse;
                setQRLink(qrLink);
            }
            setIsLoading(false);
        };

        getQrLink();
    }, []);

    return (
        <div className="row mfa-qr">
            <div className="col-lg-12 d-flex flex-column justify-content-between">
                <div className="row justify-content-center">
                    <div className="col-lg-12 text-center mt-2 mfa-qr-container p-0">
                        {isLoading ? (
                            <div className="qr-code-loader mb-8" />
                        ) : (
                            <div className="mb-8">
                                <QRCode size={200} value={qrLink} />
                            </div>
                        )}
                        <h3 className="mfa-qr-text mt-0 mb-8">
                            Scan using authenticator to link SocialPilot
                        </h3>
                        <p className="mb-0 text-grey">
                            Use Google authenticator, Microsoft authenticator,
                            Authy or Duo mobile
                            <a
                                href="https://help.socialpilot.co/article/438-why-am-i-being-asked-to-re-connect-my-accounts#Account-disconnection-due-to-Missing-Roles-andor-Permissions-on-Faceb-VNHYK"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {' '}
                                Learn more.
                            </a>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-end">
                        <Button
                            bsClass={`btn btn-primary btn-medium`}
                            disabled={false}
                            variant="primary"
                            onClick={next}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QRScreen;
