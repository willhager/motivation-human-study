import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import InConversation from "./pages/InConversation/InConversation";

import "./App.css";
import InDemographic from "./pages/inDemographic/InDemographic";
import CompletedRegistration from "./pages/CompletedRegistration/CompletedRegistration";

function AppRoutes() {
  const [studyState, setStudyState] = useState({});
  const location = useLocation();

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/.netlify/functions/state");
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setStudyState(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [location.pathname, fetchState]);

  useEffect(() => {
    if (studyState.active === true) return;
    const intervalId = setInterval(fetchState, 10000);
    return () => clearInterval(intervalId);
  }, [studyState.active, fetchState]);

  if (studyState.active !== true) {
    return <Inactive />;
  }
  // if (studyState.inDemographic == true) {
  //   return <InDemographic />;
  // }

  return (
    <Routes>
      <Route path="/" element={<PreSurveyPage studyState={studyState} />} />
      <Route path="/reflection" element={<Primes studyState={studyState} />} />
      <Route path="/importance" element={<AIOpinionImportance studyState={studyState} />}/>
      <Route path="/waiting" element={<Waiting studyState={studyState} />}/>
      <Route path="/policy" element={<PolicyMessaging studyState={studyState} />}/>
      <Route path="/conversationbrief" element={<ConversationalSetup studyState={studyState} />}/>
      <Route path="/conversation" element={<Conversation studyState={studyState} />}/>
      <Route path="/postconversation" element={<PostSurvey studyState={studyState} />}/>
      <Route path="/debrief1" element={<PostSurveyOpen1 studyState={studyState}/>}/>
      {/*<Route path="/debrief2" element={<PostSurveyOpen2 studyState={studyState}/>}/>*/}
      <Route path="/debrief3" element={<PostSurveySuspicion studyState={studyState}/>}/>
      <Route path="/exit" element={<Debrief studyState={studyState}/>}/>
      <Route path="/inConversation" element={<InConversation />}/>
      <Route path="/inDemographic" element={<InDemographic studyState={studyState}/>}/>
      <Route path="/completedRegistration" element={<CompletedRegistration/>}/>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;