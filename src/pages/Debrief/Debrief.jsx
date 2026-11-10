import {useLocation} from "react-router-dom";
import { useState } from "react";

function Debrief({ studyState }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [finishText, setFinishText] = useState(null);
    const [withdrawal, setWithdrawal] = useState(false);
    const [buttonText, setButtonText] = useState("Submit")
    const [docID, setDocID] = useState(null);

    const state = useLocation();
    const {username, uID} = state.state;

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
                setButtonText("Submit");
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
                setButtonText("Submit");
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
                    <p>Thank you for taking part in our experiment! We will review your responses and provide you with payment in the coming days. We would like to debrief you further about the intention of the experiment. What you took part in was hosted by the Computer Science department at the University of Rochester, but the policy you read is not necessarily being considered by your state university system. Rather, the policies you were shown were adapted from current policies from other universities. To our knowledge, your university system is not considering a specific pro- or anti-AI policy at this time.</p>
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
                    
                </div>
            </div>
        </div>
    )

}

export default Debrief;