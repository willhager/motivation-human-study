import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

import "./PreSurveyPage.css"
function PreSurveyPage( { studyState }) {
    const [prolificID, setProlificID] = useState(null);
    const [username, setUsername] = useState(null);
    const [consented, setConsented] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null)
    const [buttonText, setButtonText] = useState("Continue")

    const navigate = useNavigate();
    
    const on_button_click = async () => {
        if (!prolificID || !username) {
            setErrorMessage("Missing Prolific ID or username. Please input these values before continuing.");
            return;
        }

        if (!consented) {
            setErrorMessage("Please read through the provided consent document and check the box before continuing.");
            return;
        }

        if (await usernameTaken() === true) {
            setErrorMessage("Username already taken. Please choose a different one.");
            return;
        }

        if (usernameProfane(username) === true) {
            setErrorMessage("Username contains profanity. Please choose a username that doesn't contain profanity.");
            return;
        }


        setErrorMessage(null);
        const ok = await save();
        if (ok) {
            navigate("/1", { replace: true, state : {username, uID: ok } });
        }

    }

    const save = async () => {
        setButtonText("Loading...");
        let studyID = studyState.id;
        try {
            const res = await fetch("/.netlify/functions/pre_survey", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prolificID,
                    username,
                    studyID,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }
            const id = await res.json();
            return id.insertedId;
        } catch (err) {
            console.error(err);
            setErrorMessage("Something went wrong saving your information. Please try again.");
            return false;
        } finally {
            setButtonText("Continue");
        }
    };

    const usernameTaken = async () => {
        let studyID = studyState.id;
        try {
            const res = await fetch(`/.netlify/functions/pre_survey?id=${studyID}`, {
                method: "QUERY",
            });
            if (!res.ok) {
                throw new Error("Something went wrong saving your information. Please try again.");
            }
            const data = await res.json();
            console.log(data);
            console.log(username);
            for(let i = 0; i < data.length; i+= 1) {
                console.log(data[i].username);
                if (data[i].username === username) {
                    return true;
                }
            }
            return false;
        }
        catch (err) {
            console.error(err);
            setErrorMessage("Something went wrong saving your information. Please try again.");
            return true;
        }
    }

    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
        });

    const usernameProfane = (username) => matcher.hasMatch(username);


    return (
        <>
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p> 
                        Thank you for joining our study! It will begin shortly. Please provide the unique code you were given upon registration, read the consent form, and then click through to the next page where the study will begin. During the study, you will be asked a few questions, presented with some information, then engage in a virtual, text-based conversation with another individual about the information you are shown. Afterwards, you will be asked a few more questions and then be debriefed and exit the survey. You should receive payment for your participation shortly after completion of the study.
                    </p>
                    
                    <div className="row-centered">
                        <h3>*Prolific ID:</h3>
                        <input className="input-short" type="text" required  onChange={e => setProlificID(e.target.value)}></input>
                    </div>
                    <p>Please also pick a username for the virtual, text-based conversation portion of the study. Please avoid any using any personally-identifying information in your username (eg. full names, location, etc).</p>
                    <div className="row-centered">
                        <h3>*Username: </h3>
                        <input className="input-short" type="text" required onChange={e => setUsername(e.target.value)}></input>
                    </div>
                </div>

                <div className="box-internal">
                    <h2>Consent document:</h2>
                    <object className="consent-embedding" data={"src/assets/4_Scott_Teaching.pdf"} type="application/pdf">
                        <p>
                            Your browser can't display PDFs. <a href={"src/assets/4_Scott_Teaching.pdf"}>Download it instead</a>.
                        </p>
                    </object>
                    <div className="row-centered">
                        <h3>*I have read and agree to the provided consent document.</h3>
                        <input className="input-short" type="checkbox" onChange={e => setConsented(e.target.checked)}></input>
                    </div>
                    <button className="next-button" onClick={on_button_click} disabled={buttonText === "Loading..."}>{buttonText}</button>
                    <div className="row-centered">
                        <h2 className="error-message">{errorMessage}</h2>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default PreSurveyPage;