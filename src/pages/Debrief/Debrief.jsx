import {useLocation, useNavigate} from "react-router-dom";
import { useState } from "react";

function Debrief({ studyState }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [consented, setConsented] = useState(null);
    const [buttonText, setButtonText] = useState("Continue")

    const state = useLocation();
    const navigate = useNavigate();
    const {username, uID, insertedID} = state.state;

    const on_button_clicked = async () => {
        setButtonText("Loading");

        if (consented === null) {
            setErrorMessage("Please read through the document and select a consent option.");
            setButtonText("Continue");
            return;
        }

        try {
            const res = await fetch(`/.netlify/functions/post_survey?id=${insertedID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    consent: {
                        capture_consent_data_use: consented,
                        consent_data_use_at: new Date().toISOString() 
                    }
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
            navigate("/exit", {replace: true, state: {username, uID, insertedID}});
        }
    }

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <h2>Study Debrief:</h2>
                    <p>Thank you for participating in our study! Please read the following document and make a consent statement below.</p>
                    <object className="consent-embedding" data={"/consent_to_data_use.pdf"} type="application/pdf">
                        <p>
                            There was an error displaying the PDF. <a href={"/consent_to_procedures.pdf"}>Download it instead</a>.
                        </p>
                    </object>
                    
                    <br/>
                    <br/>
                    <div className="row-centered">
                        <div className="likert-item" key={"consent-false"}>
                            <input
                            type="radio"
                            name="consent"
                            value={true}
                            checked={consented === true}
                            onChange={() => setConsented(true)}
                            />
                            <h4>I have read and agree to the provided data use consent document.</h4>
                        </div>
                        <div className="likert-item" key={"consent-true"}>
                            <input
                            type="radio"
                            name="consent"
                            value={false}
                            checked={consented === false}
                            onChange={() => setConsented(false)}
                            />
                            <h4>I have read and do not agree to the provided data use consent document.</h4>
                        </div>
                    </div>

                    <button className="next-button" onClick={on_button_clicked}>{buttonText}</button>
                    <h2 className="error-message">{errorMessage}</h2>
                    
                </div>
            </div>
        </div>
    )

}

export default Debrief;