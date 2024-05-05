import React, {useState} from 'react'
import reactCSS from 'reactcss'
import {SketchPicker} from 'react-color'
import {Popover} from "@material-ui/core";

interface Props {
    defaultValue: string,
    onChange: (color: string) => void,
    className?: any
}

function ColorSketchPicker(props: Props) {
    const [displayColorPicker, setDisplayColorPicker] = useState(props.defaultValue)
    const styles: any = reactCSS({
        'default': {
            color: {
                width: '100%',

                height: '20px',
                borderRadius: '2px',
                background: displayColorPicker,
            },
            swatch: {
                padding: '5px',
                width: "100%",
                display: "flex",
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                cursor: 'pointer',
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

    const handleChange = (color: any) => {
        let color_ = rgba2hex(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
        setDisplayColorPicker(color_);
        props.onChange(color_)
    };
    return <div className={props.className}>
        <div style={styles.swatch} onClick={handleClick}>
            <div style={styles.color}/>
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
                boxShadow: "var(--box-shadow-low)"
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={handleClose}
        >

            <SketchPicker color={displayColorPicker} onChange={handleChange}/>
        </Popover>

    </div>
}

export default ColorSketchPicker
