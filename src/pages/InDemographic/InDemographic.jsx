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

    const likerts_opinion = ["1. Strongly Disagree", "2. Moderately Disagree", "3. Slightly Disagree", "4. Neither Agree nor Disagree", "5. Slightly Agree", "6. Moderately Agree", "7. Strongly Agree"];
    const ai_knowledge_options = ["1. No knowledge", "2. A little knowledge", "3. Some knowledge", "4. Moderate knowledge", "5. Decent knowledge", "6. Very knowledgeable", "7. Expert knowledge"]
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
        let userAge = age_options[age - 1];
        let userGender = gender_options[gender - 1];
        let userRace = race_options[race - 1];
        let userEdu = edu_options[edu - 1];
        let userPol = pol_options[pol - 1];
        let userPolStr = pol_str_options[polstr - 1];
        try {
            const res = await fetch("/.netlify/functions/demographics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prolificID,
                    age : userAge,
                    gender: userGender,
                    race: userRace,
                    edu: userEdu, 
                    eduBackground,
                    pol: userPol,
                    polstr: userPolStr,
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

                    <div className="row-centered"><h3>Demographic Questions</h3></div>
                    <h4 className="centered-no-margin">Age</h4>
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
                    <h4 className="centered-no-margin">Gender</h4>
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
                    <h4 className="centered-no-margin">Race</h4>
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
                    <h4 className="centered-no-margin">Education Level</h4>
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
                    <div className="row-centered">
                        <h3>Please enter your major:</h3>
                        <input className="input-short" type="text" required  onChange={e => setEduBackground(e.target.value)}></input>
                    </div>
                    <h4 className="centered-no-margin">Political Affiliation</h4>
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
                    <h4 className="centered-no-margin">Strength of Political Affiliation</h4>
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

                    <h3 className="row-centered">Generative AI Questions</h3>
                    <h4>On a scale from 1-7, where 1 = “Strongly Disagree” and 7 = “Strongly Agree”, what is your current stance towards generative AI, generally?</h4>
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

                    <h4>On a scale from 1-7, where 1 = “Strongly Disagree” and 7 = “Strongly Agree”, what is your current stance towards generative AI, specifically in a University setting?</h4>
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

                    <h4>On a scale from 1-7, where 1 = “No knowledge” and 7 = “Expert knowledge”, how knowledgeable are you about generative AI usage?</h4>
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
                    <button className="next-button" type="button" onClick={on_button_click} disabled={buttonText === "Loading..."}>{buttonText}</button>
                    <div> <h2 className="error-message">{errorMessage}</h2> </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default InDemographic;