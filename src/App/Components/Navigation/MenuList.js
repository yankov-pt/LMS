
import React, { useEffect, useState } from "react";
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link, Route, Switch, Redirect, useLocation, useRouteMatch } from 'react-router-dom';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import clsx from 'clsx';
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import List from "@material-ui/core/List";
import { Collapse } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    card: {
        borderRadius: '20px',
        '& img':
        {
            borderRadius: '20px 20px 0 0',

            width: "100%",
            objectFit: 'cover',
            height: '400px'
        }
    },
    textCont: {
        padding: '15px',
        '& h3': {
            margin: '0'
        }
    },
    innerMenu: {
        padding: '4px 4px 4px 32px'
    },
    exprow: {
        display: 'flex',
        alignItems: 'center'
    },
    expCont: {
        display: 'inline-block',
        width: 'calc(100% - 25px)',

    }
}));
function MenuList({ path, name, withAuth, component, index, innerMenu }) {
    const classes = useStyles();
    const [expand, setExpand] = useState(false);

    return (
        <>
            {innerMenu ?
                (
                    <div className={classes.exprow}>
                        <ListItem button key={path} className={innerMenu ? classes.exp : null}>

                            <Link key={path} style={{ textDecoration: 'none', 'color': 'black' }} className={classes.expCont} to={path} >
                                {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                                <ListItemText primary={name} />
                            </Link>
                            {expand
                                ? <ExpandLessIcon style={{ cursor: 'pointer' }} onClick={() => setExpand(!expand)} />
                                : <ExpandMoreIcon style={{ cursor: 'pointer' }} onClick={() => setExpand(!expand)} />}
                        </ListItem>
                    </div>)
                : <Link key={path} style={{ textDecoration: 'none', 'color': 'black' }} to={path} >
                    <ListItem button key={path} className={innerMenu ? classes.exp : null}>
                        {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                        <ListItemText primary={name} />


                    </ListItem>
                </Link>
            }

            {innerMenu ?
                <Collapse in={expand} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding >
                        {innerMenu.map(item => (
                            <Link key={item.path} style={{ textDecoration: 'none', 'color': 'black' }} to={{ pathname: item.path }} >
                                <ListItem button key={item.path} className={clsx(classes.innerMenu)}>

                                    <ListItemText primary={item.name} />
                                </ListItem>
                            </Link>
                        ))}

                    </List>
                </Collapse>
                : null
            }
        </>
    );
}

export default MenuList;
