import {useLocation, useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from 'react';

import InstructionPopup from "./InstructionPopup";
import Linkify from "./Linkify";

import "./Conversation.css";

function Conversation( { studyState } ) {
    let navigate = useNavigate();
    const state = useLocation();
    const id = studyState.id;
    const {username, uID} = state.state;
    const [conversation, setConversation] = useState([]);
    const [userResponse, setUserResponse] = useState("");

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyingToName, setReplyingToName] = useState(null);
    const [replyingToHead, setReplyingToHead] = useState(null);

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

    const policy = studyState.policy;

    let policyText = ""
    switch (policy) {
        case "pro":
            policyText = "Currently, your state university system is considering adopting a policy that would allow for use of generative AI, particularly for experimentation in their coursework.";
            break;
        case "anti":
            policyText = "Currently, your state university system is considering adopting a policy that would ban the use of generative AI related to all coursework.";
            break;
    }

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
        let timestamp = new Date().toISOString();
        let messageId = uID + timestamp;
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
                    timestamp: timestamp,
                    messageId: messageId,
                    replyingTo: replyingTo,
                    replyingToName: replyingToName,
                    replyingToHead: replyingToHead
                }),
            });
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
        } catch(err) {
            console.log(err);
        }
    }

    const set_replying = (item) => {
        if (item === null) {
            setReplyingTo(null);
            setReplyingToName(null);
            return;
        }
        setReplyingTo(item.messageId); 
        setReplyingToName(item.username);
        setReplyingToHead(item.response.slice(0, 20));
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
        setReplyingTo(null);
        setReplyingToName(null);
        setReplyingToHead(null);
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
            navigate("/postconversation", { replace: true, state: { username, uID, secondsTyping : secondsTypingRef.current, secondsReading: secondsReadingRef.current} });
        }
    }, [secondsLeft, navigate, username, uID]);


    let next = 0
    let colorByUser = {uID: "green"};
    const colors = ["orange", "yellow", "blue", "red", "purple", "brown"];

    const emojiRegex =
        /[\p{Extended_Pictographic}\p{Emoji_Modifier}\u{1F1E6}-\u{1F1FF}\u{E0020}-\u{E007F}\u200D\uFE0F\u20E3]/gu;

    const stripEmojis = (str) => str.replace(emojiRegex, "");


    const condition = studyState.condition;
    let conditionText = ""
    switch (condition) {
        case "directional":
            conditionText = "We would like to reemphasize that we are interested in student opinions, and encourage you to share your position openly during the conversation.";
            break;
        case "accuracy":
            conditionText = "We would like to reemphasize that you keep an open mind about the policy during the conversation.";
            break;
    }

    return (
        <div className="page">
            <h1>Discussion of AI Policy</h1>
            <p>With the rapid pace of advancement in the artificial intelligence (AI) field, your state university system is currently considering whether or not to create policy and regulation around the use of AI in the classroom. {policyText} Please discuss the policy you were shown with others. {conditionText}</p>
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
                            <section id={item.messageId} key={item.messageId}>
                                <div className={`conversation-item ${color}`}>
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
                                    {item.replyingTo && <p className="conversation-p-small-no-margin" onClick={() => {
                                                                                                            const el = document.getElementById(item.replyingTo);
                                                                                                            if (!el) return;
                                                                                                            el.scrollIntoView({ behavior: "smooth", block: "center" });
                                                                                                            el.classList.add("flash");
                                                                                                            setTimeout(() => el.classList.remove("flash"), 1500);
                                                                                                        }}>Replying to {item.replyingToName}: {item.replyingToHead}...</p>}
                                    <p><Linkify text={item.response} /></p>
                                    {color !== "green" && <button  className="reply-button" onClick={() => {set_replying(item)}}>Reply</button>}
                                </div>
                            </section>
                        )
                        })}
                        <div ref={bottomRef} />
                    </div>
                    {replyingToName &&
                        <div className="conversation-replying-to-line-row">
                            <p className="conversation-replying-to-line">Replying to: {replyingToName}</p>
                            <button className="replying-to-line-x" onClick={() => set_replying(null)}>X</button>
                        </div>
                        
                    }  
                    <div className="conversation-row-centered">
                        <textarea id="user-input" value={userResponse} onChange={e => updateUserResponse(stripEmojis(e.target.value))} onKeyDown={handleKeyDown}/>
                        <button className="conversation-next-button" onClick={() => send_update(userResponse)}>Send</button>
                    </div>
                </div>
                <button className="next-button" onClick={() => setInstructionPopup(true)}>View Full Instructions</button>
                {instructionPopup && <InstructionPopup studyState = {studyState} onClose={() => setInstructionPopup(false)}></InstructionPopup>}
            </div>
        </div>
    )
}

export default Conversation;