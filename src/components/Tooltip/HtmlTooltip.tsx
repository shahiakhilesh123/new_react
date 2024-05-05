import React from 'react'
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Typography, IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { TooltipProps } from '@material-ui/core/Tooltip';

export default function HtmlTooltip(props: TooltipProps) {
  const StyledTooltip = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

  return <StyledTooltip {...props} />
}

export function OpenRateWithTooltip(props: any) {

  return (<>
    Open Rate
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Not 100% accurate due to privacy settings of email providers.</Typography>
        </React.Fragment>
      }
    >
      <IconButton>
        <InfoIcon style={{ color: "#bdbdbd" }} />
      </IconButton>
    </HtmlTooltip>
  </>)
}

