import {useLocation, useNavigate} from "react-router-dom";
import { useEffect , useState, useRef} from "react";

function ConversationalSetup({studyState}) {
    const [enoughSetupTime, setEnoughSetupTime] = useState(false)
    const enoughSetupTimeRef = useRef();
    const navigate = useNavigate();
    const state = useLocation();
    const {username, uID, insertedID} = state.state;
    const condition = studyState.condition;

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
        enoughSetupTimeRef.current = enoughSetupTime;
    }, [enoughSetupTime]);

    useEffect(() => {
        const hadTime = async () => {
            console.log(enoughSetupTime);
            try {
                const res = await fetch(`/.netlify/functions/primes?id=${insertedID}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        enoughSetupTime: enoughSetupTimeRef.current,
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
        const timer = setTimeout(() => {
            hadTime()
            navigate("/conversation", { replace: true, state: { username, uID } });
        }, 1 * 60 * 1000);

        return () => clearTimeout(timer);
    }, [navigate, username, uID]);


    return (
        <div className="page">
            <div className="box">
                <h1>Discussion of AI Policy</h1>
                <div className="box-internal">
                    <p>You will now interact with other students virtually regarding the policy you just received. Both you and the other student saw the same policy. Please do not include any personally identifiable information (PII) such as names, emails, etc. in your conversations. Please provide at least 5 responses to the conversation to receive payment. Please take 10 minutes to discuss the topic and the topic only. While the topic covers generative AI, the study is interested in the true opinions of students, so please write your own responses. Failure to comply with staying on topic and using AI will result in a lack of payment. </p>
                    <p>Additionally, feel free to open additional tabs to find outside information to support the conversation. Again, we would like to emphasize that if you use outside information that it be from human written opinions or articles (and not AI generated summaries of information).</p>
                </div>
                <div className="box-internal">
                    <p>{conditionText}</p>
                    <p>This page will automatically redirect you to the next part of the study.</p>
                    <div className="row-centered">
                        <p>Check this if you had enough time to read all of the text on this page. Note that this has no effect on your reward and is merely used to help calibrate future iterations of the study.</p>
                        <input className="input-short" type="checkbox" checked={enoughSetupTime} onChange={e => setEnoughSetupTime(e.target.checked)}></input>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationalSetup;