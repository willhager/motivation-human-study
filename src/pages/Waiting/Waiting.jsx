import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";


function Waiting({studyState}) {
    const state = useLocation();
    const {username, prolificID} = state.state;
    const [localState, setLocalState] = useState(studyState);
    const navigate = useNavigate();

      useEffect(() => {
            if (!prolificID) return;
            fetch("/.netlify/functions/state", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prolificID }),
            }).catch(console.log);
        }, [prolificID]);


    useEffect(() => {
        async function checkState() {
          try {
            const res = await fetch("/.netlify/functions/state", {
              method: "GET",
            });
            if (!res.ok) {
              throw new Error(`Request failed: ${res.status}`);
            }
            const data = await res.json();
            setLocalState(data);
            if (data.arrived >= data.participants){
                navigate("/4", {replace: true, state : {username, prolificID}});
                return;
            }
          } catch (err) {
            console.log(err)
          }
        }
        checkState();
    
        const intervalId = setInterval(checkState, 3000);
        return () => clearInterval(intervalId);
      }, [prolificID, username, navigate]);

    

    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p>Thank you for your participation so far. Please wait and the study will continue shortly.</p>
                </div>
            </div>
        </div>
    )
}

export default Waiting;