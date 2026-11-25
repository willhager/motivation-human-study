import {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";


function AIOpinionImportance({ studyState }) {
    const [opinionStrength, setopinionStrength] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [buttonText, setButtonText] = useState("Continue");

    const likert_values = ["Not important at all", "A little important", "Somewhat important", "Moderately important", "Decently important", "Very important", "Extremely important"];

    const navigate = useNavigate();
    const state = useLocation();
    const {username, uID, insertedID} = state.state;

    if (studyState.inConversation) {
        navigate("/inConversation");
    }


    const on_button_clicked = async () => {
        if (!opinionStrength) {
            setErrorMessage("Please ensure you've responded to all questions on the page.")
        }
        else {
            const ok = await save();
            if (ok){
                navigate("/waiting", {replace: true, state: {username, uID, insertedID}});
            }
        }
    }

    const save = async () => {
        setButtonText("Loading...");
        document.getElementById("next-button").disabled = true;
        try {
            const res = await fetch(`/.netlify/functions/primes?id=${insertedID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    opinionStrength,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }
            return true;
        } catch (err) {
            console.error(err);
            setErrorMessage("Something went wrong saving your information. Please try again.");
            document.getElementById("next-button").disabled = false;
            return false;
        } finally {
            setButtonText("Continue");
            document.getElementById("next-button").disabled = false;
        }
    }

    return (
        <div className="page">
            <div className="box">
                <h1>Importance of Opinion on AI Usage</h1>
                <div className="box-internal">
                    <p>How important is your opinion on AI usage to you?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="likert"
                                value={value}
                                checked={opinionStrength === value}
                                onChange={() => setopinionStrength(value)}
                                />
                                {/* <p>{value}</p> */}
                                <p>{likert_values[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <button className="next-button" id="next-button" onClick={on_button_clicked}>{buttonText}</button>
                    <h2 className="error-message">{errorMessage}</h2>
                </div>
            </div>
        </div>
    )
}

export default AIOpinionImportance;