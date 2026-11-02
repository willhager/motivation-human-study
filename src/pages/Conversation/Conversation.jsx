import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from 'react';

import "./Conversation.css";

function Conversation( { studyState } ) {
    let navigate = useNavigate();
    const state = useLocation();
    const id = studyState.id;
    const {username, prolificID} = state.state;
    const [conversation, setConversation] = useState([]);
    const [userResponse, setUserResponse] = useState("");

    const TOTAL_SECONDS = 600;
    const [deadline] = useState(() => Date.now() + TOTAL_SECONDS * 1000);
    const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

    const [typingClock, setTypingClock] = useState(null);
    const [secondsTyping, setSecondsTyping] = useState(0);
    const bottomRef = useRef(null);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const fetchConversation = async () => {
        try {
            const res = await fetch(`/.netlify/functions/conversations?id=${id}`, {
                method: "QUERY",
            });
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            const data = await res.json();
            const sorted = [...data.conversation].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            setConversation(sorted);
        } catch (err) {
            console.log(err);
        }
    }

    const updateConversation = async (response) => {
        try {
            const res = await fetch(`/.netlify/functions/conversations?id=${id}`, {
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    prolificID,
                    response,
                    timestamp: new Date().toISOString()
                }),
            });
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
        } catch(err) {
            console.log(err);
        }
    }

    const send_update = async (response) => {
        if (response.trim() === "" || response === null) {
            return;
        }
        let elapsed = 0;
        if (typingClock !== null) {
            elapsed = typingClock - secondsLeft;
            setSecondsTyping((prev) => prev + elapsed);
        }
        setTypingClock(null);
        setUserResponse("");
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        await updateConversation(response);
        await fetchConversation();
    }

    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send_update(userResponse);
        }
    }

    const updateUserResponse = (content)  => {
        if (typingClock === null && content !== ""){
            setTypingClock(secondsLeft);
        }
        setUserResponse(content);
    }

    useEffect(() => {
            fetchConversation();
            const intervalId = setInterval(fetchConversation, 3000);
            return () => clearInterval(intervalId);
      }, []);

    useEffect(() => {
        const tick = () => {
            const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setSecondsLeft(remaining);
        };
        tick();
        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);
    }, [deadline]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            navigate("/7", { replace: true, state: { username, prolificID, secondsTyping} });
        }
    }, [secondsLeft, navigate, username, prolificID]);


    return (
        <div className="page">
            <div className="header-absolute">
                <div className="time-remaining-box">
                    <h3>Timer: {minutes}:{String(seconds).padStart(2, "0")} remaining</h3>
                </div>
            </div>
            <div className="box">
                <div className="box-internal conversation">
                    {conversation.map((item, index) => {
                        let isSelf = "";
                        if (item.prolificID === prolificID) {
                            isSelf = "self";
                        }

                        return (
                            <div className={`conversation-item ${isSelf}`} key={index}>
                                <div className="conversation-item-header-row">
                                    <h4>{item.username}</h4>
                                    <h4>{new Date(item.timestamp).toLocaleString("en-US", {
                                        month: "2-digit",
                                        day: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                        })}</h4>
                                </div>
                                <p>{item.response}</p>
                            </div>
                        )
                    })}
                    <div className="conversation-row-centered">
                        <textarea id="user-input" value={userResponse} onChange={e => updateUserResponse(e.target.value)} onKeyDown={handleKeyDown}/>
                        <button className="conversation-next-button" onClick={() => send_update(userResponse)}>Send</button>
                    </div>
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    )
}

export default Conversation;