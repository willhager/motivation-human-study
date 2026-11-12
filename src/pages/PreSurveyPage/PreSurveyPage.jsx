import { useState, useEffect } from "react";
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


    useEffect(() => {
        if (studyState.inConversation) {
            navigate("/inConversation");
    }
    }, [studyState.inConversation]);

    useEffect(() => {
        if (studyState.inDemographic) {
            navigate("/inDemographic");
    }
    }, [studyState.inDemographic]);
    
    const on_button_click = async () => {
        setButtonText("Loading...");
        if (!prolificID || !username) {
            setErrorMessage("Missing Prolific ID or username. Please input these values before continuing.");
            setButtonText("Continue");
            return;
        }

        if (!consented) {
            setErrorMessage("Please read through the provided consent document and check the box before continuing.");
            setButtonText("Continue");
            return;
        }

        if (await usernameTaken() === true) {
            setErrorMessage("Username already taken. Please choose a different one.");
            setButtonText("Continue");
            return;
        }

        if (await prolificIDTaken() === true) {
            setErrorMessage("Your prolific ID has been marked as already in the study. Please double check that you've typed it in correctly.");
            setButtonText("Continue");
            return;
        }

        if (usernameProfane(username) === true) {
            setErrorMessage("Username contains profanity. Please choose a username that doesn't contain profanity.");
            setButtonText("Continue");
            return;
        }

        setErrorMessage(null);
        const ok = await save();
        if (ok) {
            navigate("/reflection", { replace: true, state : {username, uID: ok } });
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
                    consented,
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
                method: "GET",
            });
            if (!res.ok) {
                throw new Error("Something went wrong saving your information. Please try again.");
            }
            const data = await res.json();
            for(let i = 0; i < data.length; i+= 1) {
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

    const prolificIDTaken = async () => {
        let studyID = studyState.id;
        try {
            const res = await fetch(`/.netlify/functions/pre_survey?id=${studyID}`, {
                method: "GET",
            });
            if (!res.ok) {
                throw new Error("Something went wrong saving your information. Please try again.");
            }
            const data = await res.json();
            for(let i = 0; i < data.length; i+= 1) {
                if (data[i].prolificID === prolificID) {
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
                    <p> Thank you for joining our study! It will begin shortly. Please provide your Prolific ID, read the consent form, and then click through to the next page where the study will begin. </p>
                    <p>During the study, you will be asked a few questions, presented with some information, then engage in a virtual, text-based conversation with other individuals about the information you are shown. Afterwards, you will be asked a few more questions and then be debriefed and exit the survey. You should receive payment for your participation shortly after completion of the study. Please allow up to one business week to receive payment to allow the research team to verify your engaged participation. If you withdraw consent after completing the study, you will still receive payment for your time.<b> However, if you fail our attention checks embedded within the study, you will not receive compensation.</b></p>
                    <h4>NOTE – the anonymized conversations may be made public alongside our academic paper, so avoid entering any personally identifiable information (PII) about you or any real person.</h4>
                    <p>Although your identifying information will be removed, there is still a small risk that someone could infer your identity from speaking style or contextual information. We will use rigorous anonymization procedures, but complete anonymity cannot be guaranteed.</p>
                    <p>The task, including reading these instructions, interaction, and the survey, is expected to take less than 15-30 minutes for each interaction.</p>
                    <p>Contact for any support: npate@ur.rochester.edu </p>

                    <div className="row-centered">
                        <h3>*Prolific ID:</h3>
                        <input className="input-short" type="text" required  onChange={e => setProlificID(e.target.value)}></input>
                    </div>
                    <p>Please also pick a username for the virtual, text-based conversation portion of the study.</p>
                    <h4>Please avoid any using any personally-identifying information in your username (eg. full names, location, etc).</h4>
                    <div className="row-centered">
                        <h3>*Username: </h3>
                        <input className="input-short" type="text" required onChange={e => setUsername(e.target.value)}></input>
                    </div>
                </div>

                <div className="box-internal">
                    <h2>Consent document:</h2>
                    <object className="consent-embedding" data={"/consent_form.docx.pdf"} type="application/pdf">
                        <p>
                            Your browser can't display PDFs. <a href={"/consent_form.docx.pdf"}>Download it instead</a>.
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