import {useState} from "react";
import { useNavigate } from "react-router-dom";

import CompletedRegistration from "../CompletedRegistration/CompletedRegistration";

import "./InDemographic.css"

function Dropdown({ name, label, options, value, onChange }) {
  return (
    <>
      <label style={{marginRight: 1 + 'em'}} htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="" disabled>Select...</option>
        {options.map((text, i) => (
          <option key={i + 1} value={i + 1}>{text}</option>
        ))}
      </select>
    </>
  );
}


function InDemographic( { studyState }) {
    const [prolificID, setProlificID] = useState(null);
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState(null);
    const [race, setRace] = useState(null);
    const [edu, setEdu] = useState(null);
    const [eduEnrollment, setEduEnrollment] = useState(null);
    const [eduBackground, setEduBackground] = useState(null);
    const [pol, setPol] = useState(null);
    const [polstr, setPolStr] = useState(null);
    const [generalAIAttitude, setGeneralAIAttitude] = useState(null);
    const [classroomAIAttitude, setClassroomAIAttitude] = useState(null);
    const [initialKnowledge, setInitialKnowledge] = useState(null);

    const [buttonText, setButtonText] = useState("Continue")

    const likerts_opinion = ["1. Extremely Negative", "2. Moderately Negative", "3. Slightly Negative", "4. Neutral", "5. Slightly Positive", "6. Moderately Positive", "7. Extremely Positive"];
    const ai_knowledge_options = ["Not knowledgeable at all", "A little knowledgeable", "Somewhat knowledgeable", "Moderately knowledgeable", "Decently knowledgeable", "Very knowledgeable", "Expertly knowledgeable"]
    const age_options = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
    const gender_options = ["Female", "Male", "Non-Binary", "Prefer not to answer"]
    const race_options = ["White", "Black or African American", "Hispanic", "Asian", "Native American or Alaska Native", "Other"]
    const edu_options = ["High School Diploma", "Bachelor's Degree", "Associate's Degree", "Graduate or Professional Degree", "Other"]
    const pol_options = ["Democrat", "Independent", "Republican", "Other"]
    const pol_str_options = ["Very Strong", "Somewhat Strong", "Neutral", "Somewhat Weak", "Very Weak"]

    const [errorMessage, setErrorMessage] = useState(null)

    const navigate = useNavigate();

    const on_button_click = async () => {
        if (!prolificID || !age || !gender || !race || !edu || !eduEnrollment || !eduBackground || !pol || !polstr || !generalAIAttitude || !classroomAIAttitude || !initialKnowledge) {
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
                    eduEnrollment,
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
                    <div className="row-centered">
                        <Dropdown name="age" label="Age:" options={age_options} value={age} onChange={setAge} />
                    </div>
                    <br></br>
                    <div className="row-centered">
                        <Dropdown name="gender" label="Gender:" options={gender_options} value={gender} onChange={setGender} />

                    </div>
                    <br></br>
                    <div className="row-centered">
                        <Dropdown name="race" label="Race:" options={race_options} value={race} onChange={setRace} />
                    </div>
                    <br></br>
                    <div className="row-centered">
                        <Dropdown name="edu" label="Education:" options={edu_options} value={edu} onChange={setEdu} />
                    </div>

                    <br></br>

                    <h4>Are you currently enrolled at a college/university?</h4>
                    <div className="row-centered">
                        <Dropdown name="enrollment" label="Education Enrollment" options={["Yes", "No"]} value={eduEnrollment} onChange={setEduEnrollment} />
                    </div>
                    <br></br>

                    <div className="row-centered">
                        <h4>Please enter your major:</h4>
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
                        {Array.from({ length: 5 }, (_, i) => {
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
                    <h4>What is your current stance towards generative AI, generally?</h4>
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

                    <h4>What is your current stance towards generative AI, specifically in a University setting?</h4>
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

                    <h4>How knowledgeable are you about generative AI usage?</h4>
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