import {useState} from "react"
import {useNavigate, useLocation} from "react-router-dom"

function PostSurveyOpen2({studyState}) {
    const [suspicion, setSuspicion] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [buttonText, setButtonText] = useState("Continue");

    const navigate = useNavigate();
    const state = useLocation();
    const {username, prolificID, insertedID} = state.state;
    const on_button_clicked = async () => {
        if (suspicion == null || suspicion == "") {
            setErrorMessage("You must respond to the question to continue");
        }
        const id = await save()
        if (id){
                navigate("/10", {replace: true, state: {username, prolificID, insertedID: id}});
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
                    suspicion,
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
                <div className="box-internal">
                    <p>Next, did you find anything unusual about the university’s proposed AI policy when you first read about it?</p>
                    <textarea rows={4} maxLength={1500} required onChange={e => setSuspicion(e.target.value)}></textarea>
                    <button className="next-button" onClick={on_button_clicked}>{buttonText}</button>
                    <h2 className="error-message">{errorMessage}</h2>
                </div>
            </div>
        </div>
    )

}

export default PostSurveyOpen2;