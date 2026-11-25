import {useLocation, useNavigate} from "react-router-dom";
import { useEffect , useState, useRef} from "react";

function ConversationalSetup({studyState}) {
    const [enoughSetupTime_setup, setEnoughSetupTime_setup] = useState(false)
    const enoughSetupTime_setupRef = useRef();
    const navigate = useNavigate();
    const state = useLocation();
    const {username, uID, insertedID} = state.state;
    const condition = studyState.condition;

    const TOTAL_SECONDS_setup = 120;
    
    const [deadline] = useState(() => {
        const key = `deadline-${uID}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            return Number(saved);
        }
        const newDeadline = Date.now() + TOTAL_SECONDS_setup * 1000;
        localStorage.setItem(key, String(newDeadline));
        return newDeadline;
    });    

    const [secondsLeft_setup, setSecondsLeft_setup] = useState(TOTAL_SECONDS_setup);

    const minutes = Math.floor(secondsLeft_setup / 60);
    const seconds = secondsLeft_setup % 60;

    const hadTime = async () => {
            console.log(enoughSetupTime_setup);
            try {
                const res = await fetch(`/.netlify/functions/primes?id=${insertedID}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        enoughSetupTime_setup: enoughSetupTime_setupRef.current,
                        timestamp: new Date().toISOString(),
                    }),
                });

                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status}`);
                }
            } catch (err) {
                console.error(err);
            }
        }
    
    useEffect(() => {
        const tick = () => {
            const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setSecondsLeft_setup(remaining);
        };
        tick();
        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);
    }, [deadline]);

    useEffect(() => {
        if (secondsLeft_setup <= 0) {
            localStorage.removeItem(`deadline-${uID}`);
            hadTime();
            navigate("/conversation", { replace: true, state: { username, uID } });
        }
    }, [secondsLeft_setup, navigate, username, uID]);

    let conditionText = ""
    switch (condition) {
        case "directional":
            conditionText = "We would like to reemphasize that we are interested in student opinions, and encourage you to share your position openly during the conversation.";
            break;
        case "accuracy":
            conditionText = "We would like to reemphasize that you keep an open mind about the policy during the conversation.";
            break;
    }

    useEffect(() => {
        enoughSetupTime_setupRef.current = enoughSetupTime_setup;
    }, [enoughSetupTime_setup]);


    return (
        <div className="page">
            <div className="box">
                <div className="header-absolute-right-offset">
                    <div className="time-remaining-box">
                        <h3>Conversation begins in: {minutes}:{String(seconds).padStart(2, "0")}</h3>
                    </div>
                </div>
                <h1>Discussion of AI Policy</h1>
                <div className="box-internal">
                    <p>You will now interact with other students virtually regarding the policy you just received. Both you and the other students saw the same policy. Please take 10 minutes to discuss the topic and the topic only.</p>
                    <ul>
                        <li> Do not include any personally identifiable information (PII) such as names, emails, etc. in your conversations. </li>
                        <li> Provide at least 5 responses to the conversation to receive payment. </li>
                        <li> While the topic covers generative AI, the study is interested in the true opinions of students, so please write your own responses. Failure to comply with staying on topic and using AI will result in a lack of payment.</li>
                        <li> Feel free to use the next minute to find outside information to support the conversation. </li>
                        <li> If you use outside information, select sources written by other humans (and not AI generated summaries, such as Google AI Overviews). </li>
                    </ul>
                    {/* <p>You will now interact with other students virtually regarding the policy you just received. Both you and the others student saw the same policy. Please do not include any personally identifiable information (PII) such as names, emails, etc. in your conversations. Please provide at least 5 responses to the conversation to receive payment. Please take 10 minutes to discuss the topic and the topic only. While the topic covers generative AI, the study is interested in the true opinions of students, so please write your own responses. Failure to comply with staying on topic and using AI will result in a lack of payment. </p> */}
                    {/* <p>Feel free to use the next minute to find outside information to support the conversation. Again, we would like to emphasize that if you use outside information that it be from human written opinions or articles (and not AI generated summaries of information).</p> */}
                </div>
                <div className="box-internal">
                    <p>{conditionText}</p>
                    <p>This page will automatically redirect you to the next part of the study.</p>
                    <div className="row-centered">
                        <p>Check this if you had enough time to read all of the text on this page. Note that this has no effect on your reward and is merely used to help calibrate future iterations of the study.</p>
                        <input className="input-short" type="checkbox" checked={enoughSetupTime_setup} onChange={e => setEnoughSetupTime_setup(e.target.checked)}></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationalSetup;