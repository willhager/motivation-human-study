import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PreSurveyPage from "./pages/PreSurveyPage/PreSurveyPage";
import Primes from "./pages/Primes/Primes";
import AIOpinionImportance from "./pages/AIOpinionImportance/AIOpinionImportance";
import Inactive from "./pages/InactivePage/Inactive";
import Waiting from "./pages/Waiting/Waiting";
import PolicyMessaging from "./pages/PolicyMessaging/PolicyMessaging";
import ConversationalSetup from "./pages/ConversationalSetup/ConversationalSetup";
import Conversation from "./pages/Conversation/Conversation";
import PostSurvey from "./pages/PostSurvey/PostSurvey";
import PostSurveyOpen1 from "./pages/PostSurveyOpen1/PostSurveyOpen1";
import PostSurveyOpen2 from "./pages/PostSurveyOpen2/PostSurveyOpen2";
import PostSurveySuspicion from "./pages/PostSurveySuspicion/PostSurveySuspicion";
import Debrief from "./pages/Debrief/Debrief"

import "./App.css";

function App() {
  const [studyState, setStudyState] = useState({});

  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch("/.netlify/functions/state", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        const data = await res.json();
        setStudyState(data);
      } catch (err) {
        console.log(err)
      }
    }
    fetchState();

    if (studyState.active !== true) {
      const intervalId = setInterval(fetchState, 10000); // every 10s
      return () => clearInterval(intervalId); // cleanup
    }
  }, [studyState.active]);

  if (studyState.active === true) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PreSurveyPage />} />
          <Route path="/1" element={<Primes studyState={studyState} />} />
          <Route path="/2" element={<AIOpinionImportance studyState={studyState} />}/>
          <Route path="/3" element={<Waiting studyState={studyState}/>} />
          <Route path="/4" element={<PolicyMessaging studyState={studyState} />}/>
          <Route path="/5" element={<ConversationalSetup studyState={studyState} />}/>
          <Route path="/6" element={<Conversation studyState={studyState} />}/>
          <Route path="/7" element={<PostSurvey studyState={studyState} />}/>
          <Route path="/8" element={<PostSurveyOpen1 studyState={studyState}/>}/>
          <Route path="/9" element={<PostSurveyOpen2 studyState={studyState}/>}/>
          <Route path="/10" element={<PostSurveySuspicion studyState={studyState}/>}/>
          <Route path="/11" element={<Debrief studyState={studyState}/>}/>
        </Routes>
      </BrowserRouter>
    );
  }

  return <Inactive />;
}

export default App;