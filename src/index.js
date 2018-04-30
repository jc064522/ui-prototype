import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import Routes from './Routes';
import BasicExample from './BasicExample';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
