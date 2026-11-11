import { useEffect, useState } from "react"

function InstructionPopup({ studyState, onClose }){
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true); 

        document.body.classList.add("no-scroll"); //prevent scrolling on rest of site

        const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
        document.body.classList.remove("no-scroll");
        window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    let policyText = ""
    switch (studyState.policy) {
        case "pro":
            policyText = "Currently, the University is considering adopting a policy that would allow for use of generative AI, particularly for experimentation in their coursework. This can include uses of generative AI through a website (e.g., ChatGPT or Claude from their respective websites) to the creation of specialized autonomous agents that complete large scale tasks. The University sees the potential benefits of generative AI alongside traditional education, such as providing automated feedback on assignments before submission, generating additional test problems and personalizing learning, and providing general knowledge. Furthermore, the University believes that generative AI use can provide students with additional free time to participate in extracurriculars.";
            break;
        case "anti":
            policyText = "Currently, the University is considering adopting a policy that would ban the use of generative AI related to all coursework. This can include uses of generative AI through a website (e.g., ChatGPT or Claude from their respective websites) to the creation of specialized autonomous agents that complete large scale tasks. The University sees the potential benefits of traditional education without generative AI use, such as the development of stronger course-related skills, the ability to better discern between correct and incorrect answers, and increased preparation for job interviews. Furthermore, the University believes that banning generative AI use can provide students with opportunities to connect with one another through study groups.";
            break;
    }

    //overlay onClick closes function if you click outside of the box
    //content onClick prevents click passthrough so you don't accidentally click "behind" the box
    return(
        <div className={`popup-overlay ${visible ? "show" : ""}`} onClick={onClose}>
            <div className={`popup-content ${visible ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>
                    X
                </button>
                <p>With the rapid pace of advancement in the artificial intelligence (AI) field, your state university system is currently considering whether or not to create policy and regulation around the use of AI in the classroom. Given this policy will take effect at the university level, they are interested in learning about the student population’s stance on AI use in the classroom. More importantly, the University has partnered with the Computer Science department to administer surveys and discussions about the proposed policy and its persuasiveness.</p>
                <p>{policyText}</p>
                <p>You will now interact with other students virtually regarding the policy you just received. Both you and the other student saw the same policy. Please do not include any personally identifiable information (PII) such as names, emails, etc. in your conversations. Please provide at least 5 responses to the conversation to receive payment. Please take 10 minutes to discuss the topic and the topic only. While the topic covers generative AI, the study is interested in the true opinions of students, so please write your own responses. Failure to comply with staying on topic and using AI will result in a lack of payment.</p>
                <p>Additionally, feel free to open additional tabs to find outside information to support the conversation. Again, we would like to emphasize that if you use outside information that it be from human written opinions or articles (and not AI generated summaries of information).</p>
            </div>
        </div>
    );
};

export default InstructionPopup;