
import React, { Component, Suspense, useState, useContext, useEffect } from "react";

import { BrowserRouter as Router, Link, Route, Switch, Redirect, useLocation } from 'react-router-dom';


import routes from "../routes/routes";
// import Login from "./Container/Common/Login";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme, formatMs } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import sideMenu from './Navigation/menuItems'
import CloseIcon from '@material-ui/icons/Close';
import { UserContext } from "../Context/userContext";
import Unauthorized from './Pages/Unauthorized/Unauthorized'
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    toolbarLeft: {
        display: "flex",
        alignItems: 'center'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));


function Content() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useContext(UserContext);
    const [test, setTest] = useState(false);

    useEffect(() => {
        if (user) {
            setTest(true)
        }
        console.log(user)
    }, [user])
    const handleDrawer = () => {
        setOpen(!open);
    };



    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}>
                <Toolbar className={clsx(classes.toolbar)}>
                    <div className={clsx(classes.toolbarLeft)}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawer}
                            edge="start"
                            className={clsx(classes.menuButton)}
                        >
                            {
                                open ?
                                    <CloseIcon />

                                    :
                                    <MenuIcon />

                            }
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Books
        </Typography>
                    </div>
                    
                    {user!==undefined ?
                        <div>

                            {user.role === 'admin' ?
                                <Link style={{ textDecoration: 'none', 'color': 'white', marginRight: '30px' }} to={'/admin'} >
                                    Admin
                                </Link>
                                : null}
                            <Link style={{ textDecoration: 'none', 'color': 'white' }} to={'/profile'} >
                                {user.username}
                            </Link>
                        </div>
                        :
                        <div>

                            <Link style={{ textDecoration: 'none', 'color': 'white' }} to={'/login'}>Log In</Link>
                            <p style={{ display: 'inline' }}> or </p>
                            <Link style={{ textDecoration: 'none', 'color': 'white' }} to={'/signup'}>Sign up</Link>



                        </div>
                    }
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >

                <List>
                    {sideMenu.map(({ path, name, withAuth, component, index }) => {
                        if (!withAuth) {
                            return (

                                <Link key={path} style={{ textDecoration: 'none', 'color': 'black' }} to={path} >
                                    <ListItem button key={path}>
                                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                        <ListItemText primary={name} />
                                    </ListItem>
                                </Link>
                            )
                        }
                        else {
                            if (user !== undefined) {
                                return (
                                    <Link key={path} style={{ textDecoration: 'none', 'color': 'black' }} to={path} >
                                        <ListItem button key={path}>
                                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                            <ListItemText primary={name} />
                                        </ListItem>
                                    </Link>
                                )
                            }
                        }

                    })}

                </List>

            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Suspense fallback={<h1>loading...</h1>}>
                    <Switch>
                        <>
                            {routes.map(({ path, component, type }) => {


                                return (
                                    <Route exact key={path} path={path} component={component} />
                                )


                            })}

                            {
                                localStorage.length !== 0
                                    ? <Route path="/" />
                                    : null
                            }
                        </>
                    </Switch>
                </Suspense>
            </main>
        </div>
    );
}

export default Content;