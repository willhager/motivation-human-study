import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";


function Waiting({studyState}) {
    const state = useLocation();
    const {username, uID, insertedID} = state.state;
    const [text, setText] = useState("Thank you for your participation so far. Please wait and the study will continue shortly. This process may take up to 5 minutes before moving on.");
    const navigate = useNavigate();

      useEffect(() => {
            if (!uID) return;
            async function pushUID() {
                try {
                    const res = await fetch("/.netlify/functions/state", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "uid", uID }),
                    });
                    if (!res.ok) {
                        throw new Error(`Request failed: ${res.status}`);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            pushUID();

        }, [uID]);


    useEffect(() => {
        let intervalId;
        let redirectTimer;

        async function pushAutoSection() {
            try{
                const res = await fetch("/.netlify/functions/state", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "inConversation", inConversation: true }),
                });
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
            }
            catch (err) {
                console.log(err);
            }

        }

        async function checkState() {
            try {
                const res = await fetch("/.netlify/functions/state", { method: "GET" });
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                const data = await res.json();

                if (data.arrived >= data.participants) {
                    clearInterval(intervalId); // stop polling
                    setText(`Congratulations, you will be automatically redirected to the next part of the study in 10 seconds. There will be ${data.arrived} people in the conversation, including you.`);
                    pushAutoSection();
                    redirectTimer = setTimeout(() => {
                        navigate("/policy", { replace: true, state: { username, uID, insertedID } });
                    }, 10000);
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