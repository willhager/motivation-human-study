import {useLocation} from "react-router-dom";
import { useState } from "react";

function Debrief({ studyState }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [finishText, setFinishText] = useState(null);
    const [buttonText, setButtonText] = useState("Withdraw my data")

    const state = useLocation();
    const {username, prolificID} = state.state;

    const on_button_clicked = async () => {
        setButtonText("Loading...");
        try {
            const res = await fetch(`/.netlify/functions/omissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    prolificID
                }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }
            setFinishText("We have recieved your withdrawal request and have marked your data for deletion.");
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
                    <h2>Debrief</h2>
                    <p>Thank you for taking part in our experiment! We will review your responses and provide you with payment in the coming days. We would like to debrief you further about the intention of the experiment. What you took part in was hosted by the Computer Science department at the University of Rochester, but the policy you read is not necessarily being considered by your university. Rather, the policies you were shown were adapted from current policies from other universities. To our knowledge, the University is not considering a specific pro- or anti-AI policy at this time.</p>
                    <p>The study you took part in is interested in understanding how people communicate when they are defending a position compared to when they are trying to consider multiple perspectives. In order to ensure people took part in these conversations seriously, we needed a meaningful topic to discuss with relevant stakes for participants. So, the Computer Science department at the University of Rochester designed this study with fictitious university AI policies to facilitate these conversations. We apologize for this mild deception, but we hope you understand why it was necessary to properly test our research question. If you have any comments or concerns, please feel free to reach out to npate@ur.rochester.edu.</p>
                    <p>Finally, now that you have all of the information about the study, if you would like to withdraw all of your responses and have us delete your data, you can indicate this choice below. Thank you again for participating in the study! </p>
                    <p>You may safely exit this page.</p>

                    {!finishText && 
                        <>
                            <h4>By clicking this button, you are withdrawing all of your responses. Note that this cannot be undone.</h4>
                            <button className="next-button" onClick={on_button_clicked}>{buttonText}</button>
                            {errorMessage}
                        </>
                    }

                    {finishText}
                    
                </div>
            </div>
        </div>
    )

}

export default Debrief;