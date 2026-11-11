import {useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

function PostSurveyBelievability() {
    const [believabilityScore, setBelievabilityScore] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [buttonText, setButtonText] = useState("Continue");

    const navigate = useNavigate();
    const state = useLocation();
    const {username, uID, insertedID} = state.state;

    const believable = ["Not believable at all", "A little believable", "Somewhat believable", "Moderately believable", "Decently believable", "Very believable", "Extremely believable"]

    const on_button_clicked = async () => {
        if (!believabilityScore) {
            setErrorMessage("Please ensure you've responded to all questions on the page.");
            return;
        }
        else {
            const ok = await save();
            if (ok){
                navigate("/exit", {replace: true, state: {username, uID}});
            }
        }
    }

    const save = async () => {
        setButtonText("Loading...");
        try {
            const res = await fetch(`/.netlify/functions/post_survey?id=${insertedID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    believabilityScore,
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
                <h1>Debriefing (3/3)</h1>
                <div className="box-internal">
                    <p>On a scale from 1-7, where 1 = “Not believable at all” and 7 = “Extremely believable”, how believable did you find the university’s proposal?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="likert"
                                value={value}
                                checked={believabilityScore === value}
                                onChange={() => setBelievabilityScore(value)}
                                />
                                <p>{value}</p>
                                <p>{believable[value - 1]}</p>
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

export default PostSurveyBelievability;