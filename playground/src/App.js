import React from 'react';

import { QRScreen } from 'auth-component-library';
import 'auth-component-library/dist/styles.css';

import './globalStyle/base.scss';
import './globalStyle/common.scss';

const App = () => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <QRScreen />
        </div>
    );
};

export default App;
