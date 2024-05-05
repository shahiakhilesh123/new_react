import {createStyles, withStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {LinearProgress} from "@material-ui/core";

export const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }),
)(LinearProgress);