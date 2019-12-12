import {grey100, grey400, grey500, grey700, darkBlack, white, fullBlack, orange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const pollTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
  palette: {
    primary1Color: orange500,
    primary2Color: grey700,
    primary3Color: grey400,
    accent1Color: orange500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: '#F0F0F0',
    borderColor: grey400,
    pickerHeaderColor: grey500,
    shadowColor: fullBlack,
  }
});

export default pollTheme;