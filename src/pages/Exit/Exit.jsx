import {useLocation} from "react-router-dom";
import { useState } from "react";

function Debrief({ studyState }) {
    const [feedbackButtonText, setFeedbackButtonText] = useState("Submit Optional Feedback")
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

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <h2>Debrief</h2>
                    <p>Thank you for taking part in our experiment! We will review your responses and provide you with payment in the coming days. If you have any comments or concerns, please feel free to reach out to npate@ur.rochester.edu.</p>
                    <p>You may safely exit this page.</p>

                    <p>If you have any feedback about the study, feel free to leave an optional response here.</p>
                    <textarea rows={4} maxLength={1500} required onChange={e => setGenFeedback(e.target.value)}></textarea>
                    <button className="next-button" id="feedbackbutton" onClick={on_submit_feedback}>{feedbackButtonText}</button>
                    
                </div>
            </div>
        </div>
    )

}

export default Debrief;