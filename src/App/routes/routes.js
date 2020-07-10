
import { lazy } from "react";
import { Redirect } from "react-router-dom";
const LandingPage = lazy(() => import("../Components/Pages/LandingPage/LandingPage"))
const Books = lazy(() => import("../Components/Pages/Books/Books"))
const LogIn = lazy(() => import("../Components/Pages/LogIn/LogIn"))
const SignUp = lazy(() => import("../Components/Pages/SignUp/SignUp"))
const Admin = lazy(() => import("../Components/Pages/Admin/Admin"))
const AddBook = lazy(() => import("../Components/Pages/Admin/AddBook"))
const Profile = lazy(() => import("../Components/Pages/Profile/Profile"))
const BookItem = lazy(() => import("../Components/Pages/Books/BookItem/BookItem"))
const Users = lazy(() => import("../Components/Pages/Admin/UserList"))
const UserItem = lazy(() => import("../Components/Pages/Admin/UserItem"))

export default [
    { path: "/", name: "Home", component: LandingPage },
    { path: "/home", name: "Home", component: LandingPage },
    { path: "/books", name: "Books", component: Books },
    { path: "/login", name: "LogIn", component: LogIn },
    { path: "/signup", name: "SignUp", component: SignUp },
    { path: "/admin", name: "Admin", component: Admin },
    { path: "/profile", name: "Profile", component: Profile },
    { path: "/addBook", name: "AddBook", component: AddBook },
    { path: '/books/:id', name: 'BookItem', component: BookItem },
    { path: '/users', name: 'Users', component: Users },
    { path: '/users/:id', name: 'UserItem', component: UserItem },

]
