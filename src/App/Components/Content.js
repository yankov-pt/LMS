
import React, { Component, Suspense, useState, useContext, useEffect } from "react";

import { BrowserRouter as Router, Link, Route, Switch, Redirect, useLocation } from 'react-router-dom';


import routes from "../routes/routes";
// import Login from "./Container/Common/Login";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
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
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Button from '@material-ui/core/Button';
import MenuList from './Navigation/MenuList';
import Logo from '../../images/Logo.png'
import Typography from '@material-ui/core/Typography';

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
        justifyContent: "space-between",
        backgroundColor: '#ECECEC'
    },
    toolbarLeft: {
        display: "flex",
        alignItems: 'center'
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: '#235063'
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
    MenuBtns: {
        display: 'inline-flex',
        alignItems: 'center'
    }
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
                        <img src={Logo} alt="Logo" />
                    </div>

                    {user !== undefined ?
                        <div>

                            {user.role === 'admin' ?
                                <Link style={{ textDecoration: 'none', 'color': '#235063', marginRight: '30px' }} to={'/admin'} className={classes.MenuBtns}>
                                    <VerifiedUserOutlinedIcon style={{ marginRight: '5px' }} />
                                    Admin
                                </Link>
                                : null}
                            <Link style={{ textDecoration: 'none', 'color': '#235063' }} to={'/profile'} className={classes.MenuBtns}>
                                <AccountCircleOutlinedIcon style={{ marginRight: '5px' }} />
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
                    {sideMenu.map(({ path, name, withAuth, component, index, innerMenu }) => (

                        <MenuList path={path} name={name} withAuth={withAuth} component={component} index={index} innerMenu={innerMenu} />
                    ))}

                </List>

            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Suspense fallback={
                    <Typography variant="h1" component="h2">Комфорта</Typography>
                }>
                    <Switch>
                        <>
                            {routes.map(({ path, component, type }) => {


                                return (
                                    <Route exact key={path} path={path} component={component} />
                                )


                            })}

                            {
                                localStorage.length !== 0
                                    ? <Route exact path="/" />
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