import {useLocation, useNavigate, Navigate} from "react-router-dom";
import {useState} from 'react';

function Primes({ studyState }) {
    const state = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const [response1, setResponse1] = useState(null);
    const [response2, setResponse2] = useState(null);
    const [buttonText, setButtonText] = useState("Continue")

    const navigate = useNavigate();

    if (!state.state?.username || !state.state?.prolificID) {
        return <Navigate to="/" replace />;
    }
    const { username, prolificID } = state.state;


    const on_button_clicked = async () => {
        if (!response1 || (!response2 && studyState.condition == "directional")) {
            setErrorMessage("Please ensure you've responded to all questions on the page.")
        }
        else {
            const id = await save();
            if (id){
                navigate("/2", {replace: true, state: {username, prolificID, insertedID: id}});
            }
        }
    }

    const save = async () => {
        setButtonText("Loading...");
        let body = ""
        let condition = studyState.condition
        if (studyState.condition == "directional"){
            body = JSON.stringify({
                    prolificID,
                    username,
                    response1,
                    response2,
                    condition,
                    timestamp: new Date().toISOString(),
                })
        }
        else {
            body = JSON.stringify({
                    prolificID,
                    username,
                    response1,
                    condition,
                    timestamp: new Date().toISOString(),
                })
        }
        try {
            const res = await fetch("/.netlify/functions/primes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }
            const result = await res.json();
            return result.insertedId;
        } catch (err) {
            console.error(err);
            setErrorMessage("Something went wrong saving your information. Please try again.");
            return false;
        } finally {
            setButtonText("Continue");
        }
    }

    let prime = "";
    let prime2 = "";
    let box1 = null;
    let box2 = null;
    switch (studyState.condition){
        case "accuracy":
            prime = "Artificial intelligence (AI) as a tool for higher education has received a lot of news attention, both for its advancements and its pitfalls. For this conversation, we want you to try to be as evenhanded about the issue as possible and carefully consider all of the reasons you might feel positively or negatively about AI use in universities. We are interested in understanding your opinions about both why people might support or why they might oppose this tool in order to get the most accurate student impressions we can. Please take a minute to reflect and write your thoughts below, making sure to also explain how you arrived at them.";
            box1 = <textarea rows={4} maxLength={1500} required onChange={e => setResponse1(e.target.value)}></textarea>
            break;
        case "directional":
            prime = "The rise of artificial intelligence (AI), particularly its use in education and universities, is a very polarized issue, with some individuals supporting its use and others opposing it. Think about whether you mostly support or oppose the use of AI in universities. We are interested in understanding more about your position on the issue and encourage you to defend it in your conversation. Please take a minute to reflect on your preference and why you choose to prefer that stance over the other. Please state your preference and write your beliefs about it below.";
            box1 = <textarea rows={4} maxLength={1500} required onChange={e => setResponse1(e.target.value)}></textarea>
            prime2 = "Now, please consider your biggest criticism of the other perspective. Why do you disagree with it? Please write those things below."
            box2 = <textarea rows={4} maxLength={1500} required onChange={e => setResponse2(e.target.value)}></textarea>
            break;
    }

    return (
        <div className = "page">
            <div className = "box">
                <div className="box-internal">
                    <p>{prime}</p>
                    {box1}
                    {!box2 && <button className="next-button" onClick={on_button_clicked}>{buttonText}</button> }
                </div>
                {box2 && 
                    <div className="box-internal">
                        <p>{prime2}</p>
                        {box2}
                        <button className="next-button" onClick={on_button_clicked}>{buttonText}</button>
                    </div>
                }
                <h2 className="error-message">{errorMessage}</h2>
            </div>
        </div>
    )

}

export default Primes;