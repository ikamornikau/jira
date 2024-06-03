import React from "react";
import AuthPage from "./AuthPage";
import NavMenu from "./NavMenu";

export default function App() {
    const [authorized, setAuthorized] = React.useState(localStorage.getItem('profile') ? true : false);

    const handleLogIn = () => {
        setAuthorized(true);
    }

    const handleLogOut = () => {
        setAuthorized(false);
    }

    return (
        <React.Fragment>
            {!authorized && <AuthPage notifyAuthorized={handleLogIn}/>}
            {authorized && <NavMenu notifyLogOut={handleLogOut}/>}
        </React.Fragment>
    );
}