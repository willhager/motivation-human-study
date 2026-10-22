import {useLocation, useNavigate} from "react-router-dom";


function Waiting({studyState}) {
    const state = useLocation();
    const {username, prolificID} = state.state;
    const navigate = useNavigate();

    const on_button_clicked = () => {
        navigate("/4", {replace: true, state : {username, prolificID}});
    }

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p>Thank you for your participation so far. Please wait and the study will continue shortly.</p>
                    <button className="next-button" onClick={on_button_clicked}>temporary button until we publish live</button>
                </div>
            </div>
        </div>
    )
}

export default Waiting;