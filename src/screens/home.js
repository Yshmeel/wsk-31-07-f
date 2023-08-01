import {useContext, useEffect, useState} from "react";
import {formatDate} from "../utils";
import {api} from "../api";
import {Link} from "react-router-dom";
import {AppContext} from "../context";

const HomeScreen = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const context = useContext(AppContext);

    useEffect(() => {
        setLoading(true);

        (async function() {
            const response = await api.events();
            setEvents(response.data.events);
            setLoading(false);
        }());

    }, []);

    const logout = async () => {
        await api.logout();
        context.logout();
    };

    return (
        <>
            <header className={'p-4'}>
                <div className="container justify-content-between d-flex">
                    <span className="h3">Event Booking Platform</span>

                    <div className="d-flex align-items-center gap-4">
                        {context.authorized && (
                            <span>{context.displayName}</span>
                        )}
                        {!context.authorized ? (
                            <Link to={'/login'} className={'btn btn-primary login-btn'}>
                                Login
                            </Link>
                        ) : (
                            <button type={'button'} className={'btn btn-danger'} onClick={logout}>
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <section className={'home'}>
                <div className="container">
                    {loading ? (
                        <div className={'spinner-border'}/>
                    ) : events.map((e) => {
                        return (
                            <article className={'event card mb-2'} key={`event-${e.slug}`}>
                                <div className="card-body mb-0">
                                    <Link to={`/event/${e.organizer.slug}/${e.slug}`}
                                          className={'h4 mb-2 d-block'}>{e.name}</Link>
                                    <p className={'mb-0'}>{e.organizer.name}, {formatDate(e.date)}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </>

    );
};

export default HomeScreen;