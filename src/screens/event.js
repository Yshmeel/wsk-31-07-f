import {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {AppContext} from "../context";
import {api} from "../api";

const EventScreen = () => {
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const context = useContext(AppContext);
    const params = useParams();


    useEffect(() => {
        (async function() {
            const response = await api.event(params.organizer_slug, params.event_slug);
            if(context.authorized) {
                try {
                    const registrationsR = await api.registrations();
                    setRegistrations(registrationsR.data.registrations);
                } catch(e) {
                    //
                }
            }
            setEvent(response.data);
            setLoaded(true);
        }());
    }, []);

    const currentRegistration = registrations.find((v) => v.event.id === event.id);

    return (
        <>
            <header className={'p-4'}>
                <div className="container justify-content-between d-flex">
                    <span className="h3">{loaded ? event.name : 'Event'}</span>
                    <Link to={`/event/${params.organizer_slug}/${params.event_slug}/register`}
                          disabled={!context.authorized}
                            className={'btn btn-success'}>
                        Register for this event
                    </Link>
                </div>
            </header>

            <section className={'event'}>
                <div className="container">
                    {!loaded ? (
                        <div className={'spinner-border'} />
                    ) : (
                        <>
                            <div className="event-swimlane">
                                <div className="event-swimlane-heading">
                                    <span>9:00</span>
                                    <span>11:00</span>
                                    <span>13:00</span>
                                    <span>15:00</span>
                                </div>

                                {event.channels.map((c) => {
                                    return (
                                        <div className="event-swimlane-item row">
                                            <div className="event-swimlane-item-name channel">
                                                {c.name}
                                            </div>

                                            <div className="event-swimlane-item-rooms">
                                                {c.rooms.map((v) => (
                                                    <span className={'room'}>{v.name}</span>
                                                ))}
                                            </div>

                                            <div className="event-swimlane-item-lines">
                                                {c.rooms.map((v) => {
                                                    return (
                                                        <div className={'event-swimlane-item-line'}>
                                                            {v.sessions.map((s) => {
                                                                let registered = false;

                                                                if(s.type === 'talk' && currentRegistration) {
                                                                    registered = true;
                                                                } else if(s.type === 'workshop' &&
                                                                    currentRegistration &&
                                                                    currentRegistration.event.session_ids.includes(s.id)) {
                                                                    registered = true;
                                                                }

                                                                return (
                                                                    <Link to={`/event/${params.organizer_slug}/${params.event_slug}/session/${s.id}`}
                                                                        className={`event-swimlane-item-line-block session 
                                                                            ${registered ? 'registered' : ''}`}>
                                                                        {s.title}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>

    );
};

export default EventScreen;