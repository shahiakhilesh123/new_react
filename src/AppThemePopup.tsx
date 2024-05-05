import {createTheme, responsiveFontSizes} from '@material-ui/core/styles'

const IFuturaPTHeavy: any = {
    fontFamily: 'FuturaPT',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 500,
    src: `local('FuturaPT'), url('https://dashboard.emailwish.com/assets/fonts/FuturaPTHeavy.ttf') format('truetype')`,
    unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};
const IFuturaPTBold: any = {
    fontFamily: 'FuturaPT',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 600,
    src: `local('FuturaPT'), url('https://dashboard.emailwish.com/assets/fonts/FuturaPTBold.ttf') format('truetype')`,
    unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};
// const IFuturaPTLight: any = {
//     fontFamily: 'FuturaPT',
//     fontStyle: 'normal',
//     fontDisplay: 'swap',
//     fontWeight: 400,
//     src: `local('FuturaPT'), url(${FuturaPTLight}) format('truetype')`,
//     unicodeRange:
//         'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
// };
const IFuturaPTBook: any = {
    fontFamily: 'FuturaPT',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    src: `local('FuturaPT'), url('https://dashboard.emailwish.com/assets/fonts/FuturaPTBook.ttf') format('truetype')`,
    unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const theme = createTheme({
    typography: {
        fontFamily: 'FuturaPT',
        button: {
            textTransform: "capitalize"
        }
    },
    palette: {
        primary: {
            main: '#000',
            contrastText: '#fff',
        },
        secondary: {
            main: '#17546a',
            contrastText: '#fff',
        },
        info: {
            main: '#b35a22',
            contrastText: '#fff',
        },
        warning: {
            main: '#000',
            contrastText: '#fff',
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [IFuturaPTHeavy, IFuturaPTBold, IFuturaPTBook],
            },
        },
    },
});
export default responsiveFontSizes(theme)
