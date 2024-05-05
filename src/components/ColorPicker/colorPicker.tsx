import React, {useState} from 'react'
import reactCSS from 'reactcss'
import {SketchPicker} from 'react-color'
import {createStyles, Popover} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/styles";

interface Props {
    defaultValue: string,
    onChange: (color: string) => void,
    className?: any
}

export const ColorSketchPicker2Styles = makeStyles(() =>
    createStyles({
        root: {},
        swatch: {
            padding: '5px',
            width: "100%",
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'flex',
            cursor: 'pointer',
        },
        swatchTypo: {
            paddingLeft: "10px",
            width: "80px"
        }

    },), {index: 1},
);

function ColorSketchPicker2(props: Props) {
    const classes = ColorSketchPicker2Styles();
    const [displayColorPicker, setDisplayColorPicker] = useState(props.defaultValue)
    const styles: any = reactCSS({
        'default': {
            color: {
                width: '50px',
                paddingRight: "10px",
                height: '20px',
                borderRadius: '2px',
                background: displayColorPicker,
            },

            popover: {
                position: 'absolute',
                zIndex: '100000',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

        setAnchorEl(null);
    };

    function rgba2hex(orig: any) {
        let a: any, isPercent: any,
            rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
            alpha = (rgb && rgb[4] || "").trim(),
            hex = rgb ?
                (rgb[1] | 1 << 8).toString(16).slice(1) +
                (rgb[2] | 1 << 8).toString(16).slice(1) +
                (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

        if (alpha !== "") {
            a = alpha;
        } else {
            a = 1;
        }
        // multiply before convert to HEX
        a = ((a * 255) | 1 << 8).toString(16).slice(1)
        hex = hex + a;

        return "#" + hex;
    }

    function toHex(d: number) {
        return ((d * 255) | 1 << 8).toString(16).slice(1)
    }

    const handleChange = (color: any) => {
        if (color) {
            let _hex_color = color.hex === "transparent" ? "#ffffff" : color.hex + toHex(color.rgb.a)
            setDisplayColorPicker(_hex_color);
            props.onChange(_hex_color)
        }
    };
    return <div className={props.className}>
        <div className={classes.swatch} onClick={handleClick}>
            <div style={styles.color}/>
            <Typography className={classes.swatchTypo}>{displayColorPicker}</Typography>
        </div>
        <Popover

            anchorEl={anchorEl}
            open={Boolean(anchorEl)}

            disableScrollLock={true}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            style={{
                boxShadow: "var(--box-shadow-low)",
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={handleClose}
        >

            <SketchPicker
                color={displayColorPicker} onChange={handleChange}/>
        </Popover>

    </div>
}

export default ColorSketchPicker2
