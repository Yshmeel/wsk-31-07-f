import axios from "axios";

const events = () => {
    return axios.get(`${window.apiURL}/api/v1/events`);
};

const login = (lastname, registration_code) => {
    return axios.post(`${window.apiURL}/api/v1/login`, {
        lastname,
        registration_code
    });
};

const logout = () => {
    return axios.post(`${window.apiURL}/api/v1/logout?token=${window.token}`);
};

const event = (organizerSlug, eventSlug) => {
    return axios.get(`${window.apiURL}/api/v1/organizers/${organizerSlug}/events/${eventSlug}`);
};

const registrations = () => {
    return axios.get(`${window.apiURL}/api/v1/registrations?token=${window.token}`);
};

const register = (organizerSlug, eventSlug, ticketID, sessionIDs) => {
    return axios.post(`${window.apiURL}/api/v1/organizers/${organizerSlug}/events/${eventSlug}/registration?token=${window.token}`, {
        ticket_id: ticketID,
        session_ids: sessionIDs
    });
};

export const api = {
    events,
    event,
    login,
    logout,
    registrations,
    register
};