import {useLocation} from "react-router-dom";
import { useState } from "react";

function Debrief({ studyState }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [finishText, setFinishText] = useState(null);
    const [withdrawal, setWithdrawal] = useState(false);
    const [buttonText, setButtonText] = useState("Submit Data Withdraw Request")
    const [feedbackButtonText, setFeedbackButtonText] = useState("Submit Optional Feedback")
    const [docID, setDocID] = useState(null);
    const [genFeedback, setGenFeedback] = useState(null);

    const state = useLocation();
    const {username, uID, insertedID} = state.state;

    const on_submit_feedback = async () => {
        const id = await save()
        console.log(id)

    }

    const save = async () => {
        console.log("gen")
        console.log(genFeedback)
        try {
            const res = await fetch(`/.netlify/functions/post_survey?id=${insertedID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    genFeedback
                }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }
            return insertedID;
        } catch (err) {
            console.error(err);
            setErrorText("Something went wrong saving your information. Please try again.");
            return false;
        } finally {
            // genFeedback = ""
            setFeedbackButtonText("Submitted!")
            document.getElementById("feedbackbutton").disabled = true;
        }
    }

    const on_button_clicked = async () => {
        setButtonText("Loading...");
        try {
            if (withdrawal) {
                const res = await fetch(`/.netlify/functions/omissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    uID
                }),
                });
                const result = await res.json();
                console.log(result.insertedId);
                setDocID(result.insertedId);
                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status}`);
                }
                setFinishText("We have recieved your withdrawal request and have marked your data for deletion. To undo this, simply uncheck the box and click \"submit\" again.");
                setButtonText("Submit Data Inclusion Request");
                return true;
            }
            else {
                const res = await fetch(`/.netlify/functions/omissions?id=${docID}`, {
                method: "DELETE",
                });
                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status}`);
                }
                setFinishText("We have removed the mark on your data for deletion; your data will be used in our analysis.");
                setButtonText("Submit Data Withdraw Request");
                return true;
            }

        } catch (err) {
            console.error(err);
            setFinishText("Something went wrong saving your information. Please try again.")
            return false;
        }
    }

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <h2>Debrief</h2>
                    <p>Thank you for taking part in our experiment! We will review your responses and provide you with payment in the coming days. We would like to debrief you further about the intention of the experiment. What you took part in was hosted by the Computer Science department at the University of Rochester, but the policy you read is not necessarily being considered by your state university system. Rather, the policies you were shown were adapted from current policies from other universities. To our knowledge, your state university system is not considering a specific pro- or anti-AI policy at this time.</p>
                    <p>The study you took part in is interested in understanding how people communicate when they are defending a position compared to when they are trying to consider multiple perspectives. In order to ensure people took part in these conversations seriously, we needed a meaningful topic to discuss with relevant stakes for participants. So, the Computer Science department at the University of Rochester designed this study with fictitious university AI policies to facilitate these conversations. If you have any comments or concerns, please feel free to reach out to npate@ur.rochester.edu.</p>
                    <p>Now that you have received the full information about the study, please indicate whether you would like your responses to be retained or withdrawn. Thank you for participating in the study!</p>
                    <p>You may safely exit this page.</p>
                    <div className="row-centered">
                        <h3>I would like to withdraw my responses from this survey.</h3>
                        <input className="input-short" type="checkbox" onChange={e => setWithdrawal(e.target.checked)}></input>
                    </div>
                    <button className="next-button" onClick={on_button_clicked}>{buttonText}</button>
                    <br></br>
                    {finishText}

                    <p>If you have any feedback about the study, feel free to leave an optional response here.</p>
                    <textarea rows={4} maxLength={1500} required onChange={e => setGenFeedback(e.target.value)}></textarea>
                    <button className="next-button" id="feedbackbutton" onClick={on_submit_feedback}>{feedbackButtonText}</button>
                    
                </div>
            </div>
        </div>
    )

}

export default Debrief;