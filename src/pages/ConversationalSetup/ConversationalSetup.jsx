import {useLocation, useNavigate} from "react-router-dom";
import { useEffect } from "react";

function ConversationalSetup({studyState}) {
    const navigate = useNavigate();
    const state = useLocation();
    const {username, prolificID} = state.state;
    const condition = studyState.condition;

    let conditionText = ""
    switch (condition) {
        case "directional":
            conditionText = "We would like to reemphasize that the University is interested in student opinions, and encourage you to share your position openly during the conversation.";
            break;
        case "accuracy":
            conditionText = "We would like to reemphasize that you keep an open mind about the policy during the conversation.";
            break;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
        navigate("/6", { replace: true, state: { username, prolificID } });
        }, 2 * 60 * 1000);

        return () => clearTimeout(timer);
    }, [navigate, username, prolificID]);


    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p>You will now interact with another student virtually regarding the policy you just received. Both you and the other student saw the same policy. Please provide at least 5 responses to the conversation to receive payment. Please take 10 minutes to discuss the topic and the topic only. While the topic covers generative AI, the study is interested in the true opinions of students, so please write your own responses. Failure to comply with staying on topic and using AI will result in a lack of payment. Additionally, feel free to open additional tabs to find outside information to support the conversation. Again, we would like to emphasize that if you use outside information that it be from human written opinions or articles (and not AI generated summaries of information). Please do not include any personally identifiable information (PII) such as names, emails, etc. in your conversations.</p>
                </div>
                <div className="box-internal">
                    <p>{conditionText}</p>
                </div>
            </div>
        </div>
    )
}

export default ConversationalSetup;