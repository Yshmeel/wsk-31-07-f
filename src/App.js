import {useEffect, useState} from "react";
import {AppContext} from "./context";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login";
import EventScreen from "./screens/event";
import EventSessionDetailScreen from "./screens/event-session-detail";
import EventRegisterScreen from "./screens/event-register";

window.apiURL = process.env.REACT_APP_API_URL;

const App = () => {
    const [authorized, setAuthorized] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(localStorage['token']) {
            setAuthorized(true);
            setDisplayName(localStorage['display_name']);
            window.token = localStorage['token'];
        }

        setLoaded(true);
    }, []);

    const login = (token, displayName) => {
        setAuthorized(true);
        window.token = token;
        setDisplayName(displayName);
        localStorage.setItem('display_name', displayName);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setAuthorized(false);
        window.token = '';
        setDisplayName('');
        localStorage.setItem('display_name', '');
        localStorage.setItem('token', '');
    };

    const contextValue = {
        authorized,
        login,
        logout,
        displayName
    };

    if(!loaded) {
        return null;
    }

    return (
        <AppContext.Provider value={contextValue}>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<HomeScreen />} />
                    <Route path={'/login'} element={<LoginScreen />} />
                    <Route path={`/event/:organizer_slug/:event_slug`} element={<EventScreen />} />
                    <Route path={`/event/:organizer_slug/:event_slug/session/:session_id`} element={<EventSessionDetailScreen />} />
                    <Route path={`/event/:organizer_slug/:event_slug/register`} element={<EventRegisterScreen />} />
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    )

};

export default App;