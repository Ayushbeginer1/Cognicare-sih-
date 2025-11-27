function dummyBotResponder(type, score) {
    const normType = type.replace('-', "").toUpperCase();
    let severity = "minimal";
    let suggestions = [];

    if (normType === "PHQ9") {
        if (score >= 20) {
            severity = "severe";
            suggestions = [
                "Reach out to a counselor immediately.",
                "Call a trusted friend or family member.",
                "Try grounding techniques to stay present."
            ];
        } else if (score >= 15) {
            severity = "moderately severe";
            suggestions = [
                "Consider booking a counseling session.",
                "Maintain a sleep schedule and healthy diet.",
                "Practice relaxation exercises daily."
            ];
        } else if (score >= 10) {
            severity = "moderate";
            suggestions = [
                "Keep a journal of your thoughts.",
                "Engage in light exercise or walking.",
                "Talk with peers in supportive spaces."
            ];
        } else if (score >= 5) {
            severity = "mild";
            suggestions = [
                "Practice mindfulness breathing for 5 minutes.",
                "Listen to relaxing music or guided meditation.",
                "Limit caffeine and screen time before bed."
            ];
        } else {
            severity = "minimal";
            suggestions = [
                "Maintain healthy habits.",
                "Stay socially connected.",
                "Keep practicing self-care."
            ];
        }
    }

    if (normType === "GAD7") {
        if (score >= 15) {
            severity = "severe";
            suggestions = [
                "Contact a mental health professional soon.",
                "Try progressive muscle relaxation.",
                "Reduce stimulants like caffeine."
            ];
        } else if (score >= 10) {
            severity = "moderate";
            suggestions = [
                "Schedule time for relaxation in your day.",
                "Practice deep breathing exercises.",
                "Limit excessive news or social media exposure."
            ];
        } else if (score >= 5) {
            severity = "mild";
            suggestions = [
                "Stay active with light exercise.",
                "Talk openly with friends about your worries.",
                "Try guided imagery meditation."
            ];
        } else {
            severity = "minimal";
            suggestions = [
                "Maintain routines.",
                "Continue practicing healthy stress management."
            ];
        }
    }

    if (normType === "GHQ") {
        if (score > 4) {
            severity = "distress likely";
            suggestions = [
                "Reach out to a counselor for support.",
                "Engage in calming activities like yoga.",
                "Ensure regular sleep and hydration."
            ];
        } else {
            severity = "no significant distress";
            suggestions = [
                "Keep up with positive lifestyle habits.",
                "Maintain social connections.",
                "Continue practicing relaxation techniques."
            ];
        }
    }

    return { severity, suggestions };
}

export default dummyBotResponder;