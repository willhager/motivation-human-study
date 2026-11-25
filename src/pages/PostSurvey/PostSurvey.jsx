import {useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";

function PostSurvey({ studyState }) {
    const [generalAIAttitude, setGeneralAIAttitude] = useState(null);
    const [classroomAIAttitude, setClassroomAIAttitude] = useState(null);
    const [initialKnowledge, setInitialKnowledge] = useState(null);
    const [policyOpinion, setPolicyOpinion] = useState(null);
    const [partnerCredibility, setPartnerCredibility] = useState(null);
    const [chatbotUsage, setChatbotUsage] = useState(null);

    const [attentionCheck, setAttentionCheck] = useState(null);
    const [attentionCheckPrime, setAttentionCheckPrime] = useState(null);

    const [errorText, setErrorText] = useState(null);

    const [buttonText, setButtonText] = useState("Continue")

    const navigate = useNavigate();
    const state = useLocation();
    const {username, uID, secondsTyping, secondsReading} = state.state;

    const likerts_opinion = ["Extremely Negative", "Moderately Negative", "Slightly Negative", "Neutral", "Slightly Positive", "Moderately Positive", "Extremely Positive"];
    const likerts_support = ["Strongly Oppose", "Moderately Oppose", "Slightly Oppose", "Neither Oppose nor Support", "Slightly Support", "Moderately Support", "Strongly Support"];
    // const likerts_opinion = ["Strongly Disagree", "Moderately Disagree", "Slightly Disagree", "Neither Agree nor Disagree", "Slightly Agree", "Moderately Agree", "Strongly Agree"];
    const ai_knowledge_options = ["Not knowledgeable at all", "A little knowledgeable", "Somewhat knowledgeable", "Moderately knowledgeable", "Decently knowledgeable", "Very knowledgeable", "Expertly knowledgeable"]
    const partner_credibility = ["Not credible at all", "A little credible", "Somewhat credible", "Moderately credible", "Decently credible", "Very credible", "Extremely credible"]
    const chatbot_usage = ["Never", "Rarely", "A few times a month", "A few times a week", "Daily"];
    const on_button_clicked = async () => {
        if (generalAIAttitude == null || classroomAIAttitude == null || initialKnowledge == null || policyOpinion == null || partnerCredibility == null || attentionCheck == null || attentionCheckPrime == null) {
            setErrorText("Please answer all questions on this page");
        }
        else {
            const id = await save();
            if (id){
                navigate("/debrief1", {replace: true, state: {username, uID, insertedID: id}});
            }
        }
    }


    const save = async () => {
        setButtonText("Loading...");
        document.getElementById("next-button").disabled = true;
        const condition = studyState.condition;
        const policy = studyState.policy;
        let studyID = studyState.id;
        try {
            const res = await fetch(`/.netlify/functions/post_survey`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    uID,
                    condition,
                    policy,
                    studyID,
                    generalAIAttitude,
                    classroomAIAttitude,
                    initialKnowledge,
                    policyOpinion,
                    partnerCredibility,
                    chatbotUsage,
                    attentionCheck,
                    attentionCheckPrime,
                    secondsTyping,
                    secondsReading,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }
            const result = await res.json();
            return result.insertedId;
        } catch (err) {
            console.error(err);
            setErrorText("Something went wrong saving your information. Please try again.");
            setButtonText("Continue");
            document.getElementById("next-button").disabled = false;
            return false;
        } finally {
            setButtonText("Continue");
            document.getElementById("next-button").disabled = false;
        }
    }

    return (
        <div className="page">
            <div className="box">
                <h1>Post Conversation Survey</h1>
                <div className="box-internal">

                    <p>What is your current stance towards generative AI, generally?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="gaiAttitude"
                                value={value}
                                checked={generalAIAttitude === value}
                                onChange={() => setGeneralAIAttitude(value)}
                                />
                                {/* <p>{value}</p> */}
                                <p>{likerts_opinion[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

                    <p>What is your current stance towards generative AI, specifically in a University setting?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="caiAttitude"
                                value={value}
                                checked={classroomAIAttitude === value}
                                onChange={() => setClassroomAIAttitude(value)}
                                />
                                {/* <p>{value}</p> */}
                                <p>{likerts_opinion[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

                    <p>How knowledgeable are you about generative AI usage?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="initialKnowledge"
                                value={value}
                                checked={initialKnowledge === value}
                                onChange={() => setInitialKnowledge(value)}
                                />
                                {/* <p>{value}</p> */}
                                <p>{ai_knowledge_options[value-1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

                    <p>What is your stance on the AI policy your university system is considering?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="policyOpinion"
                                value={value}
                                checked={policyOpinion === value}
                                onChange={() => setPolicyOpinion(value)}
                                />
                                {/* <p>{value}</p> */}
                                <p>{likerts_support[value-1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

                    <p>How credible did the individual with whom you conversed seem in your opinion?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="partnerCredibility"
                                value={value}
                                checked={partnerCredibility === value}
                                onChange={() => setPartnerCredibility(value)}
                                />
                                {/* <p>{value}</p> */}
                                <p>{partner_credibility[value-1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

                    <p>How often do you use AI-based chatbots? (Ex. ChatGPT, Claude)</p>
                    <div className="row-centered">
                        {Array.from({ length: 5 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="chatbotUsage"
                                value={value}
                                checked={chatbotUsage === value}
                                onChange={() => setChatbotUsage(value)}
                                />
                                <p>{value}</p>
                                <p>{chatbot_usage[value-1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

                    <p>Was the policy that you read and discussed pro-AI in the classrooms or anti-AI in the classrooms?</p>
                    <div className="row-centered">
                        <div className="likert-item" key={"attentionCheck"}>
                            <input
                            type="radio"
                            name="attentionCheck"
                            value="pro"
                            checked={attentionCheck === "pro"}
                            onChange={() => setAttentionCheck("pro")}
                            />
                            <p>Pro-AI</p>
                        </div>
                        <div className="likert-item" key={"anti"}>
                            <input
                            type="radio"
                            name="attentionCheck"
                            value="anti"
                            checked={attentionCheck === "anti"}
                            onChange={() => setAttentionCheck("anti")}
                            />
                            <p>Anti-AI</p>
                        </div>

                    </div>

                    <p>What was your instruction for participating in the conversation?</p>
                    <div className="row-centered">
                        <div className="likert-item" key={"attentionCheckPrime"}>
                            <input
                            type="radio"
                            name="attentionCheckPrime"
                            value="Keep an open mind about the policy"
                            checked={attentionCheckPrime === "Keep an open mind about the policy"}
                            onChange={() => setAttentionCheckPrime("Keep an open mind about the policy")}
                            />
                            <p>Keep an open mind about the policy</p>
                        </div>
                        <div className="likert-item" key={"attentionCheckPrime"}>
                            <input
                            type="radio"
                            name="attentionCheckPrime"
                            value="Share your position openly"
                            checked={attentionCheckPrime === "Share your position openly"}
                            onChange={() => setAttentionCheckPrime("Share your position openly")}
                            />
                            <p>Share your position openly</p>
                        </div>

                    </div>
                    <button className="next-button" id="next-button" onClick={on_button_clicked} disabled={buttonText === "Loading..."}>{buttonText}</button>
                    <h2 className="error-message">{errorText}</h2>
                </div>
            </div>
        </div>
    )
}

export default PostSurvey;