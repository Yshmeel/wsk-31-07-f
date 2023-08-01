import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {api} from "../api";
import {AppContext} from "../context";

const LoginScreen = () => {
    const [lastname, setLastname] = useState('');
    const [registrationCode, setRegistrationCode] = useState('');

    const context = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.login(lastname, registrationCode);
            context.login(response.data.token, `${response.data.firstname} ${response.data.lastname}`);
            navigate('/');
        } catch(e) {
            if(typeof e.response !== 'undefined') {
                alert(e.response.data.message);
            } else {
                console.error(e);
            }
        }
    };

    return (
        <>
            <header className={'p-4'}>
                <div className="container justify-content-between d-flex">
                    <Link to={'/'} className="h3">Login</Link>
                </div>
            </header>

            <section className={'login'}>
                <div className="container">
                    <div className="card">
                        <div className="card-body">
                            <form action="" method={'POST'} onSubmit={onSubmit}>
                                <div className="col-md-12 mb-2">
                                    <label htmlFor="lastname" className={'form-label'}>Last name *</label>
                                    <div className={'input-group'}>
                                        <input type="text" id={'lastname'} className={'form-control'} onChange={(e) => setLastname(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="col-md-12 mb-4">
                                    <label htmlFor="registration_code"  className={'form-label'}>Registration code *</label>
                                    <div className={'input-group'}>
                                        <input type="text" id={'registration_code'} className={'form-control'} onChange={(e) => setRegistrationCode(e.target.value)}/>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <button type={'submit'} className={'btn btn-primary'} id={'login'}>
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginScreen;