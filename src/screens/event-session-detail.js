import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {api} from "../api";

const EventSessionDetailScreen = () => {
    const [event, setEvent] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const params = useParams();

    useEffect(() => {
        (async function() {
            const response = await api.event(params.organizer_slug, params.event_slug);
            setEvent(response.data);
            setLoaded(true);
        }());
    }, []);

    const session = useMemo(() => {
        let dest = null;

        if(!event) {
            return null;
        }

        event.channels.forEach((v) => {
            v.rooms.forEach((r) => {
                r.sessions.forEach((s) => {
                    if(s.id === parseInt(params.session_id)) {
                        dest = s;
                    }
                });
            })
        });

        return dest;
    }, [event]);

    const title = () => {
        if(session) {
            return `${session.title} - ${session.type === 'talk' ? 'Talk' : 'Workshop'}`;
        }

        return 'Session';
    }

    return (
        <>
            <header className={'p-4'}>
                <div className="container justify-content-between d-flex">
                    <span className="h3">{loaded ? event.name : 'Event'}</span>
                </div>
            </header>

            <section className={'event-session-detail'}>
                {!loaded ? (
                    <div className={'container'}>
                        <div className={'spinner-border'} />
                    </div>
                ) : (
                    <div className="container">
                        <div className="card">
                            <div className="card-body">
                                <span className={'h3 mb-2 d-block'}>{title()}</span>
                                <p>{session.description}</p>

                                <ul>
                                    <li><b>Speaker:</b> {session.speaker}</li>
                                    <li><b>Start:</b> {session.start.split(' ')[1].substr(0, 5)}</li>
                                    <li><b>End:</b> {session.end.split(' ')[1].substr(0, 5)}</li>
                                    <li><b>Cost:</b> {session.cost || '0.00'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
};

export default EventSessionDetailScreen;