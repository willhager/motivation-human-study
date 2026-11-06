import {useState} from "react";
import { useNavigate } from "react-router-dom";

import CompletedRegistration from "../CompletedRegistration/CompletedRegistration";

import "./InDemographic.css"
function InDemographic( { studyState }) {
    const [prolificID, setProlificID] = useState(null);
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState(null);
    const [race, setRace] = useState(null);
    const [edu, setEdu] = useState(null);
    const [eduBackground, setEduBackground] = useState(null);
    const [pol, setPol] = useState(null);
    const [polstr, setPolStr] = useState(null);
    const [generalAIAttitude, setGeneralAIAttitude] = useState(null);
    const [classroomAIAttitude, setClassroomAIAttitude] = useState(null);
    const [initialKnowledge, setInitialKnowledge] = useState(null);

    const [buttonText, setButtonText] = useState("Continue")

    const likerts_opinion = ["Strongly Disagree", "Moderately Disagree", "Slightly Disagree", "Neither Agree nor Disagree", "Slightly Agree", "Moderately Agree", "Strongly Agree"];
    const ai_knowledge_options = ["No knowledge", "", "", "Moderate knowledge", "", "", "Extremely knowledgeable"]
    const age_options = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
    const gender_options = ["Female", "Male", "Non-Binary", "Prefer not to answer"]
    const race_options = ["White", "Black or African American", "Hispanic", "Asian", "Native American or Alaska Native", "Other"]
    const edu_options = ["High School Diploma", "Bachelor's Degree", "Associate's Degree", "Graduate or Professional Degree", "Other"]
    const pol_options = ["Democrat", "Independent", "Republican", "Other"]
    const pol_str_options = ["Very Strong", "Somewhat Strong", "Neutral", "Somewhat Weak", "Very Weak"]

    const [errorMessage, setErrorMessage] = useState(null)

    const navigate = useNavigate();

    const on_button_click = async () => {
        if (!prolificID || !age || !gender || !race || !edu || !eduBackground || !pol || !polstr || !generalAIAttitude || !classroomAIAttitude || !initialKnowledge) {
            setErrorMessage("Please fill out all information to receive code.");
            return;
        }

        setErrorMessage(null);
        const ok = await save();
        if (ok) {
            navigate("/completedRegistration");
        }

    }

    const save = async () => {
        setButtonText("Loading...");
        try {
            const res = await fetch("/.netlify/functions/demographics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prolificID,
                    age,
                    gender,
                    race,
                    edu, 
                    eduBackground,
                    pol,
                    polstr,
                    generalAIAttitude,
                    classroomAIAttitude,
                    initialKnowledge
                }),
            });

            if (!res.ok) {
                throw new Error(`Server responded with ${res.status}`);
            }
            const id = await res.json();
            return id.insertedId;
        } catch (err) {
            console.error(err);
            setErrorMessage("Something went wrong saving your information. Please try again.");
            return false;
        } finally {
            setButtonText("Continue");
        }
    };

    return (
        <>
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p> 
                        Thank you for signing up for our study! Please enter the following information. Submitting will provide you with the password to sign up. Please note that this is only study sign up, and the actual study will take place at the date and time specified on the posting.
                    </p>

                    
                    <div className="row-centered">
                        <h3>*Prolific ID:</h3>
                        <input className="input-short" type="text" required  onChange={e => setProlificID(e.target.value)}></input>
                    </div>

                    <div>Demographic Questions</div>
                    <p>Age</p>
                    <div className="row-centered">
                        {Array.from({ length: 6 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="age"
                                value={value}
                                checked={age === value}
                                onChange={() => setAge(value)}
                                />
                                <p>{age_options[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>
                    <p>Gender</p>
                    <div className="row-centered">
                        {Array.from({ length: 4 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="gender"
                                value={value}
                                checked={gender === value}
                                onChange={() => setGender(value)}
                                />
                                <p>{gender_options[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>
                    <p>Race</p>
                    <div className="row-centered">
                        {Array.from({ length: 6 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="race"
                                value={value}
                                checked={race === value}
                                onChange={() => setRace(value)}
                                />
                                <p>{race_options[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>
                    <p>Education Level</p>
                    <div className="row-centered">
                        {Array.from({ length: 5 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="edu"
                                value={value}
                                checked={edu === value}
                                onChange={() => setEdu(value)}
                                />
                                <p>{edu_options[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>
                    <div>
                        <h3>Please enter your major:</h3>
                        <input className="input-short" type="text" required  onChange={e => setEduBackground(e.target.value)}></input>
                    </div>
                    <p>Political Affiliation</p>
                    <div className="row-centered">
                        {Array.from({ length: 4 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="pol"
                                value={value}
                                checked={pol === value}
                                onChange={() => setPol(value)}
                                />
                                <p>{pol_options[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>
                    <p>Strength of Political Affiliation</p>
                    <div className="row-centered">
                        {Array.from({ length: 4 }, (_, i) => {
                            const value = i + 1;
                            return (
                            <div className="likert-item" key={value}>
                                <input
                                type="radio"
                                name="polstr"
                                value={value}
                                checked={polstr === value}
                                onChange={() => setPolStr(value)}
                                />
                                <p>{pol_str_options[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

                    <div>Generative AI Questions</div>
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
                                <p>{likerts_opinion[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

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
                                <p>{likerts_opinion[value - 1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>

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
                                <p>{ai_knowledge_options[value-1]}</p>
                            </div>
                            );
                        })}
                    </div>
                    <br></br>
                </div>
                <button type="button" onClick={on_button_click} disabled={buttonText === "Loading..."}>{buttonText}</button>
                <div> <h2 className="error-message">{errorMessage}</h2> </div>
            </div>
        </div>
        </>
    )
}

export default InDemographic;