import {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {api} from "../api";

const EventRegisterScreen = () => {
    const [event, setEvent] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [checkedSessions, setCheckedSessions] = useState([]);
    const params = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        (async function() {
            const response = await api.event(params.organizer_slug, params.event_slug);
            setEvent(response.data);
            setLoaded(true);
        }());
    }, []);

    const workshopSessions = useMemo(() => {
        let dest = [];

        if(!event) {
            return null;
        }

        event.channels.forEach((v) => {
            v.rooms.forEach((r) => {
                r.sessions.forEach((s) => {
                    if(s.type === 'workshop') {
                        dest.push(s);
                    }
                });
            })
        });

        return dest;
    }, [event, checkedSessions]);

    const toggleWorkshopSession = (id) => {
        let newCheckedSessions = [...checkedSessions];

        if(newCheckedSessions.includes(id)) {
            newCheckedSessions = newCheckedSessions.filter((v) => v !== id);
        } else {
            newCheckedSessions.push(id);
        }

        setCheckedSessions(newCheckedSessions);
    };

    const ticketCost = () => {
        if(selectedTicket) {
            return event.tickets.find((v) => v.id === selectedTicket)?.cost;
        }

        return '0.00';
    };

    const workshopsCost = () => {
        if(checkedSessions.length !== 0) {
            return `${workshopSessions
                .filter((v) => checkedSessions.includes(v.id)).map((v) => parseFloat(v.cost))
                ?.reduce((prev, next) => prev + next, 0)}.00`;
        }

        return '0.00';
    };

    const totalCost = () => {
        return `${parseFloat(ticketCost()) + parseFloat(workshopsCost())}.00`;
    };

    const onPurchase = async (e) => {
        e.preventDefault();

        try {
            await api.register(params.organizer_slug, params.event_slug, selectedTicket, checkedSessions);

            navigate(`/event/${params.organizer_slug}/${params.event_slug}`);
            setTimeout(() => {
                alert('Registration successful');
            }, 1000);
        } catch(e) {
            console.error(e);
        }
    };

    return (
        <>
            <header className={'p-4'}>
                <div className="container justify-content-between d-flex">
                    <span className="h3">Register for the event</span>
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
                                <span className={'h3 mb-3 d-block'}>{event.name}</span>

                                <div className="d-flex flex-wrap">
                                    {event.tickets.map((e) => {
                                        return (
                                            <div className={`ticket card w-25 flex-grow-1 ${!e.available ? 'ticket-disabled' : ''}`}
                                                 key={`ticket-${e.id}`}
                                                onClick={() => e.available ? setSelectedTicket(e.id) : null}>
                                                <div className="card-body d-flex align-items-center">
                                                    <input type="checkbox"
                                                           style={{
                                                               width: 24,
                                                               height: 24,
                                                           }}
                                                           key={selectedTicket}
                                                           defaultChecked={selectedTicket === e.id}/>

                                                    <div className="ticket-title m-3">
                                                        <div className="ticket-title-heading justify-content-between d-flex align-items-center">
                                                            <span className={'h5 mb-0'}>{e.name}</span>
                                                            <span className={'mx-2 d-block'}>{e.cost}</span>
                                                        </div>

                                                        {e.description !== '-' && (
                                                            <span className={'mt-2'}>{e.description}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className={'mt-4'}>
                                    <span className={'h3 d-block mb-2'}>Select additional workshops you want to book:</span>

                                    {workshopSessions.map((s) => {
                                        return (
                                            <div className={'d-flex gap-2 align-items-center mb-2'} key={`workshop-${s.id}`}>
                                                <input type={'checkbox'} id={`workshop-${s.id}`}
                                                       key={checkedSessions.includes(s.id)}
                                                       defaultChecked={checkedSessions.includes(s.id)}
                                                       onChange={() => toggleWorkshopSession(s.id)} />
                                                <label htmlFor={`workshop-${s.id}`} className={'workshop'}>{s.title}</label>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="purchase-footer w-100 d-flex justify-content-end">
                                    <div className="purchase-footer-inner w-25 d-flex justify-content-end flex-column">

                                        <div className={'d-flex justify-content-between'}>
                                            <b>Event ticket:</b>
                                            <span>{ticketCost()}</span>
                                        </div>
                                        <div className={'d-flex justify-content-between'}>
                                            <b>Additional workshops:</b>
                                            <span>{workshopsCost()}</span>
                                        </div>
                                        <hr />
                                        <div className={'d-flex justify-content-between mb-3'}>
                                            <b>Total:</b>
                                            <b>{totalCost()}</b>
                                        </div>
                                        <button type={'button'} className={'btn btn-success'}
                                                onClick={onPurchase}
                                                disabled={!selectedTicket}>
                                            Purchase
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
};

export default EventRegisterScreen;