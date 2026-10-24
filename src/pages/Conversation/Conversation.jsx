import {useLocation, useNavigate} from "react-router-dom";

function Conversation( {studyState} ) {
    let navigate = useNavigate();
    const state = useLocation();
    const {username, prolificID} = state.state;

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <h3>temporary filler</h3>
                    <button className="next-button" onClick={() => navigate("/7", { replace: true, state: { username, prolificID } })}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Conversation;