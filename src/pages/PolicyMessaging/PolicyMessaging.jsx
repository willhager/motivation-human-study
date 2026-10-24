import {useLocation, useNavigate} from "react-router-dom";
import { useEffect } from "react";

function PolicyMessaging({studyState}) {
    const navigate = useNavigate();
    const state = useLocation();
    const {username, prolificID} = state.state;
    const policy = studyState.policy;

    let policyText = ""
    switch (policy) {
        case "pro":
            policyText = "Currently, the University is considering adopting a policy that would allow for use of generative AI, particularly for experimentation in their coursework. This can include uses of generative AI through a website (e.g., ChatGPT or Claude from their respective websites) to the creation of specialized autonomous agents that complete large scale tasks. The University sees the potential benefits of generative AI alongside traditional education, such as providing automated feedback on assignments before submission, generating additional test problems and personalizing learning, and providing general knowledge. Furthermore, the University believes that generative AI use can provide students with additional free time to participate in extracurriculars.";
            break;
        case "anti":
            policyText = "Currently, the University is considering adopting a policy that would ban the use of generative AI related to all coursework. This can include uses of generative AI through a website (e.g., ChatGPT or Claude from their respective websites) to the creation of specialized autonomous agents that complete large scale tasks. The University sees the potential benefits of traditional education without generative AI use, such as the development of stronger course-related skills, the ability to better discern between correct and incorrect answers, and increased preparation for job interviews. Furthermore, the University believes that banning generative AI use can provide students with opportunities to connect with one another through study groups.";
            break;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
        navigate("/5", { replace: true, state: { username, prolificID } });
        }, 2 * 6 * 1000);

        return () => clearTimeout(timer);
    }, [navigate, username, prolificID]);


    return (
        <div className="page">
            <div className="box">
                <div className="box-internal">
                    <p>With the rapid pace of advancement in the artificial intelligence (AI) field, your state university system is currently considering whether or not to create policy and regulation around the use of AI in the classroom. Given this policy will take effect at the university level, they are interested in learning about the student population’s stance on AI use in the classroom. More importantly, the University has partnered with the Computer Science department to administer surveys and discussions about the proposed policy and its persuasiveness.</p>
                </div>
                <div className="box-internal">
                    <h3 className="no-bottom-margin">Policy:</h3>
                    <p>{policyText}</p>
                    <p>This page will automatically redirect you to the next part of the study.</p>
                </div>
            </div>
        </div>
    )
}

export default PolicyMessaging;