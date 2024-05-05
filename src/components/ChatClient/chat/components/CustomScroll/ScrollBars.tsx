import React, {useCallback, useMemo, useState} from "react";
import RSC from "react-scrollbars-custom";

export function Scrollbar({children, ...props}: any) {
    const [isScrolling, setIsScrolling] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const isShow = isScrolling || isMouseOver;

    const onScrollStart = useCallback(() => {
        setIsScrolling(true);
    }, []);
    const onScrollStop = useCallback(() => {
        setIsScrolling(false);
    }, []);
    const onMouseEnter = useCallback(() => {
        setIsMouseOver(true);
    }, []);
    const onMouseLeave = useCallback(() => {
        setIsMouseOver(false);
    }, []);

    const trackProps = useMemo(() => ({
        renderer: ({elementRef, style, ...restProps}: any) => (
            <span
                {...restProps}
                ref={elementRef}
                style={{...style, opacity: isShow ? 1 : 0, transition: "opacity 0.4s ease-in-out",}}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        )
    }), [isShow, onMouseEnter, onMouseLeave]);

    return (
        <RSC
            {...props}
            wrapperProps={{
                renderer: ({elementRef, style, ...restProps}) => (
                    <div {...restProps} ref={elementRef} style={{...style, right: 0}}/>
                ),
            }}
            trackXProps={trackProps}
            trackYProps={trackProps}
            onScrollStart={onScrollStart}
            onScrollStop={onScrollStop}
            scrollDetectionThreshold={500} // ms
        >
            {children}
        </RSC>
    );
}
