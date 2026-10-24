import {useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";

function PostSurvey({ studyState }) {
    const [generalAIAttitude, setGeneralAIAttitude] = useState(null);
    const [classroomAIAttitude, setClassroomAIAttitude] = useState(null);
    const [initialKnowledge, setInitialKnowledge] = useState(null);
    const [policyOpinion, setPolicyOpinion] = useState(null);
    const [opinionImportance, setOpinionImportance] = useState(null);
    const [partnerCredibility, setPartnerCredibility] = useState(null);
    const [attentionCheck, setAttentionCheck] = useState(null);

    const [errorText, setErrorText] = useState(null);

    const [buttonText, setButtonText] = useState("Continue")

    const navigate = useNavigate();
    const state = useLocation();
    const {username, prolificID} = state.state;

    const on_button_clicked = async () => {
        if (generalAIAttitude == null || classroomAIAttitude == null || initialKnowledge == null || policyOpinion == null || opinionImportance == null || partnerCredibility == null || attentionCheck == null) {
            setErrorText("Please answer all questions on this page");
        }
        else {
            const id = await save();
            if (id){
                navigate("/8", {replace: true, state: {username, prolificID, insertedID: id}});
            }
        }
    }


    const save = async () => {
        setButtonText("Loading...");
        const condition = studyState.condition;
        const policy = studyState.policy;
        try {
            const res = await fetch(`/.netlify/functions/post_survey`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    prolificID,
                    condition,
                    policy,
                    generalAIAttitude,
                    classroomAIAttitude,
                    initialKnowledge,
                    policyOpinion,
                    opinionImportance,
                    partnerCredibility,
                    attentionCheck,
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
            return false;
        } finally {
            setButtonText("Continue");
        }
    }

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">

                    <p>On a scale from 1-7, where 1 = “Strongly Disagree” and 7 = “Strongly Agree”, what is your current stance towards generative AI, generally?</p>
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
                                <p>{value}</p>
                            </div>
                            );
                        })}
                    </div>

                    <p>On a scale from 1-7, where 1 = “Strongly Disagree” and 7 = “Strongly Agree”, what is your current stance towards generative AI, specifically in a University setting?</p>
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
                                <p>{value}</p>
                            </div>
                            );
                        })}
                    </div>

                    <p>On a scale from 1-7, where 1 = “No knowledge” and 7 = “Expert knowledge”, how knowledgeable are you about generative AI usage?</p>
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
                                <p>{value}</p>
                            </div>
                            );
                        })}
                    </div>

                    <p>On a scale from 1-7, where 1 = “Strongly Disapprove” and 7 = “Strongly Support”, what is your stance on the AI policy the University is considering?</p>
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
                                <p>{value}</p>
                            </div>
                            );
                        })}
                    </div>

                    <p>On a scale from 1-7, where 1 = “Not important at all” and 7 = “Extremely important”, how important is your opinion on AI usage to you?</p>
                    <div className="row-centered">
                        {Array.from({ length: 7 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="opinionImportance"
                                value={value}
                                checked={opinionImportance === value}
                                onChange={() => setOpinionImportance(value)}
                                />
                                <p>{value}</p>
                            </div>
                            );
                        })}
                    </div>

                    <p>On a scale from 1-7, where 1 = “Not credible at all” and 7 = “Extremely credible”, how credible did the individual with whom you conversed seem in your opinion?</p>
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
                                <p>{value}</p>
                            </div>
                            );
                        })}
                    </div>

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
                            <p>pro-AI</p>
                        </div>
                        <div className="likert-item" key={"anti"}>
                            <input
                            type="radio"
                            name="attentionCheck"
                            value="anti"
                            checked={attentionCheck === "anti"}
                            onChange={() => setAttentionCheck("anti")}
                            />
                            <p>anti-AI</p>
                        </div>

                    </div>
                    <button className="next-button" onClick={on_button_clicked} disabled={buttonText === "Loading..."}>{buttonText}</button>
                    <h2 className="error-message">{errorText}</h2>
                </div>
            </div>
        </div>
    )
}

export default PostSurvey;