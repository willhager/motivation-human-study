import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from 'react';

import InstructionPopup from "./InstructionPopup";

import "./Conversation.css";

function Conversation( { studyState } ) {
    let navigate = useNavigate();
    const state = useLocation();
    const id = studyState.id;
    const {username, uID} = state.state;
    const [conversation, setConversation] = useState([]);
    const [userResponse, setUserResponse] = useState("");

    const [instructionPopup, setInstructionPopup] = useState(false);

    const typingStartRef = useRef(null);
    const secondsTypingRef = useRef([]);

    const readingStartRef = useRef(null);
    const secondsReadingRef = useRef([]);

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

    //db pull
    const fetchConversation = async () => {
        try {
            const res = await fetch(`/.netlify/functions/conversations?id=${id}`, {
                method: "GET",
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

    //db push
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

    // when send button is pressed
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

    // updates variable for user response and tracks typing time
    const updateUserResponse = (content)  => {
        if (readingStartRef.current !== null) {
            const elapsed = readingStartRef.current ? (Date.now() - readingStartRef.current) / 1000 : 0;
            readingStartRef.current = null;
            secondsReadingRef.current.push(elapsed);
            console.log(secondsReadingRef);
        }
        if (typingStartRef.current === null){
            typingStartRef.current = Date.now();
        }
        setUserResponse(content);
    }

    //3 second refresh to pull from db
    useEffect(() => {
        fetchConversation();
        const intervalId = setInterval(fetchConversation, 3000);
        return () => clearInterval(intervalId);
      }, []);

    //1 second refresh to update time remaining
    useEffect(() => {
        const tick = () => {
            const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setSecondsLeft(remaining);
        };
        tick();
        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);
    }, [deadline]);

    //scroll to bottom when convo length changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation.length]);

    useEffect(() => {
        if (conversation.length > 0 && conversation[conversation.length - 1].uID !== uID && typingStartRef.current === null && readingStartRef.current === null) {
            readingStartRef.current = Date.now();
        }
    }, [conversation.length])

    //on end of conversation, navigate
    useEffect(() => {
        if (secondsLeft <= 0) {
            localStorage.removeItem(`deadline-${uID}`);
            // navigate("/7", { replace: true, state: { username, uID, secondsTyping : secondsTypingRef.current, secondsReading: secondsReadingRef.current} });
        }
    }, [secondsLeft, navigate, username, uID]);


    let next = 0
    let colorByUser = {uID: "green"};
    const colors = ["orange", "yellow", "blue", "red", "purple", "brown"];


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
                        let color = "";
                        if (item.uID !== uID && !(item.uID in colorByUser)) {
                            colorByUser[item.uID] = colors[next % colors.length];
                            next++;
                        }
                        color = item.uID === uID ? "green" : colorByUser[item.uID];
                        return (
                            <div className={`conversation-item ${color}`} key={index}>
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
                <button className="next-button" onClick={() => setInstructionPopup(true)}>View Instructions</button>
                {instructionPopup && <InstructionPopup studyState = {studyState} onClose={() => setInstructionPopup(false)}></InstructionPopup>}
            </div>
        </div>
    )
}

export default Conversation;