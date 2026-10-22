import {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

import "./AIOpinionImportance.css"

function AIOpinionImportance({ studyState }) {
    const [opinionStrength, setopinionStrength] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [buttonText, setButtonText] = useState("Continue");

    const navigate = useNavigate();
    const state = useLocation();
    const {username, prolificID, insertedID} = state.state;

    const on_button_clicked = async () => {
        if (!opinionStrength) {
            setErrorMessage("Please ensure you've responded to all questions on the page.")
        }
        else {
            const ok = await save();
            if (ok){
                navigate("/3", {replace: true, state: {username, prolificID}});
            }
        }
    }

    const save = async () => {
        setButtonText("Loading...");
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
            return false;
        } finally {
            setButtonText("Continue");
        }
    }

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p>On a scale from 1-7, where 1 = “Not important at all” and 7 = “Extremely important”, how important is your opinion on AI usage to you?</p>
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
                                <p>{value}</p>
                            </div>
                            );
                        })}
                    </div>
                    <button className="next-button" onClick={on_button_clicked}>{buttonText}</button>
                    <h2 className="error-message">{errorMessage}</h2>
                </div>
            </div>
        </div>
    )
}

export default AIOpinionImportance;