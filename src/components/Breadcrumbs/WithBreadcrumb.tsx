import React, {createContext, useContext} from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link2 from '@material-ui/core/Link';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {IconButton} from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Link, useHistory} from "react-router-dom";

export interface BreadCrumbLink {
    text: string,
    link: string
}

export interface iBreadCrumbProps {
    links?: BreadCrumbLink[],
    setLinks?: (links: BreadCrumbLink[]) => void
}

const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                margin: theme.spacing(1),
                display: "flex",
                alignItems: "center"
            },
            link: {
                display: 'flex',
                color: "black"
            },
            icon: {
                marginRight: theme.spacing(0.2),
                width: 20,
                height: 20,
            },
        },),
    {
        classNamePrefix: "ew-breadcrumb",
    }
);

export const BreadCrumbContext = createContext<iBreadCrumbProps>({});

export default function WithBreadCrumb({children}: { children: React.ReactNode }) {
    const classes = useStyles();

    const history = useHistory();


    const {links} = useContext(BreadCrumbContext);
    return <>
        <div className={classes.root}>
            <div>
                <IconButton onClick={() => {
                    if (links && links.length > 0) {
                        history.push(links[0].link);
                    } else {
                        history.goBack();
                    }
                }}>
                    <ArrowBackIcon color={"secondary"}/>
                </IconButton>
            </div>
            <div>
                <Breadcrumbs aria-label="breadcrumb">
                    {
                        links && links.map((link, index) => {
                            return <Link2
                                component={Link}
                                color="textPrimary"
                                key={index}
                                to={link.link}
                            >
                                {link.text}
                            </Link2>
                        })
                    }
                </Breadcrumbs>
            </div>
        </div>
        {children}
    </>
}
