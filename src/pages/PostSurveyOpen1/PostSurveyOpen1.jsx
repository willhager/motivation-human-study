import {useState} from "react"
import {useNavigate, useLocation} from "react-router-dom"

function PostSurveyOpen1({studyState}) {
    const [comments, setComments] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [buttonText, setButtonText] = useState("Continue");

    const navigate = useNavigate();
    const state = useLocation();
    const {username, uID, insertedID} = state.state;
    const on_button_clicked = async () => {
        if (comments == null || comments == "") {
            setErrorMessage("You must respond to the question to continue");
            return;
        }
        const id = await save()
        if (id){
                navigate("/debrief2", {replace: true, state: {username, uID, insertedID: id}});
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
                    comments,
                    timestamp: new Date().toISOString(),
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
            setButtonText("Continue");
        }
    }

    return (
        <div className="page">
            <div className="box">
                <h1>Debriefing (1/3)</h1>
                <div className="box-internal">
                    <p>First, please let us know if there are any comments you have about the study or anything you would like to tell us about that you think might have affected your responses to the survey.</p>
                    <textarea rows={4} maxLength={1500} required onChange={e => setComments(e.target.value)}></textarea>
                    <button className="next-button" onClick={on_button_clicked}>{buttonText}</button>
                    <h2 className="error-message">{errorMessage}</h2>
                </div>
            </div>
        </div>
    )

}

export default PostSurveyOpen1;