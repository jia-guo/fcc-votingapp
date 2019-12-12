import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import pollTheme from './style/theme.js';
import './style/font-awesome.min.css';
import './index.css';

injectTapEventPlugin();
ReactDOM.render(
	<MuiThemeProvider muiTheme={pollTheme}>
		<App />
	</MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
