import React from 'react';

import 'dev-test-mfa/dist/styles.css';

import './globalStyle/base.scss';
import './globalStyle/common.scss';
import Test from './Test';

const App = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '100vh', width: '100vw' }}
        >
            <Test />
        </div>
    );
};

export default App;
