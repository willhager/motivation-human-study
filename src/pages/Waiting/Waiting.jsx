import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";


function Waiting({studyState}) {
    const state = useLocation();
    const {username, uID} = state.state;
    const [localState, setLocalState] = useState(studyState);
    const [text, setText] = useState("Thank you for your participation so far. Please wait and the study will continue shortly.");
    const navigate = useNavigate();

      useEffect(() => {
            if (!uID) return;
            fetch("/.netlify/functions/state", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uID }),
            }).catch(console.log);
        }, [uID]);


    useEffect(() => {
        let intervalId;
        let redirectTimer;

        async function checkState() {
            try {
                const res = await fetch("/.netlify/functions/state", { method: "GET" });
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                const data = await res.json();
                setLocalState(data);

                if (data.arrived >= data.participants) {
                    clearInterval(intervalId); // stop polling
                    setText(`Congratulations, you will be automatically redirected to the next part of the study in 20 seconds. There will be ${data.arrived} people in the conversation, including you.`);
                    redirectTimer = setTimeout(() => {
                        navigate("/4", { replace: true, state: { username, uID } });
                    }, 20000);
                }
            } catch (err) {
                console.log(err);
            }
        }

        checkState();
        intervalId = setInterval(checkState, 3000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(redirectTimer);
        };
    }, [uID, username, navigate]);
    

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}

export default Waiting;