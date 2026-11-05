import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from 'react';

import "./Conversation.css";

function Conversation( { studyState } ) {
    let navigate = useNavigate();
    const state = useLocation();
    const id = studyState.id;
    const {username, uID} = state.state;
    const [conversation, setConversation] = useState([]);
    const [userResponse, setUserResponse] = useState("");

    const typingStartRef = useRef(null);
    const secondsTypingRef = useRef([]);

    const TOTAL_SECONDS = 600;

    const [deadline] = useState(() => {
        const key = `deadline-${uID}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            return Number(saved);
        }
        const newDeadline = Date.now() + TOTAL_SECONDS * 1000;
        localStorage.setItem(key, String(newDeadline));
        return newDeadline;
    });    

    const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

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
                    uID,
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
        const elapsed = typingStartRef.current ? (Date.now() - typingStartRef.current) / 1000 : 0;
        typingStartRef.current = null;
        secondsTypingRef.current.push(elapsed);
        setUserResponse("");
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
        if (typingStartRef.current === null){
            typingStartRef.current = Date.now();
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
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation.length]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            localStorage.removeItem(`deadline-${uID}`);
            navigate("/7", { replace: true, state: { username, uID, secondsTyping : secondsTypingRef.current} });
        }
    }, [secondsLeft, navigate, username, uID]);


    return (
        <div className="page">
            <div className="header-absolute">
                <div className="time-remaining-box">
                    <h3>Timer: {minutes}:{String(seconds).padStart(2, "0")} remaining</h3>
                </div>
            </div>
            <div className="box">
                <div className="conversation-box-internal">
                    <div className="conversation">
                        {conversation.map((item, index) => {
                        let isSelf = "";
                        if (item.uID === uID) {
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
                        <div ref={bottomRef} />
                    </div>
                    <div className="conversation-row-centered">
                        <textarea id="user-input" value={userResponse} onChange={e => updateUserResponse(e.target.value)} onKeyDown={handleKeyDown}/>
                        <button className="conversation-next-button" onClick={() => send_update(userResponse)}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Conversation;