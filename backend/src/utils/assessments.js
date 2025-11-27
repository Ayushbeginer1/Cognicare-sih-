
// PHQ-9 answers: 0-3 per question; 9 items. Score 0-27.
function scorePHQ(answers) {
    const total = answers.reduce((sum, ans) => sum + Number(ans.answer || 0), 0);
    let interpretation = 'minimal';
    if (total >= 20 ) interpretation = 'severe';
    else if (total >= 15) interpretation = 'moderately severe';
    else if (total >= 10) interpretation = 'moderate';
    else if (total >= 5) interpretation = 'mild';
    return { score: total, interpretation };
};

// GAD-7: 7 items, 0-3 each, score 0-21. thresholds: 5, 10, 15
function scoreGAD7(answers) {
    const total = answers.reduce((sum, ans) => sum + Number(ans.answer || 0), 0);
    let interpretation = 'minimal';
    if (total >= 15 ) interpretation = 'severe';
    else if (total >= 10) interpretation = 'moderate';
    else if (total >= 5) interpretation = 'mild';
    return { score: total, interpretation };
};

// GHQ (depends on version). Provide a simple numeric sum fallback.
function scoreGHQ(answers) {
    const total = answers.reduce((sum, ans) => sum + Number(ans.answer || 0), 0);
    // Interpretation depends on GHQ version; keep generic
    let interpretation = total > 4 ? 'probable psychological distress' : 'no psychological distress';
    return { score: total, interpretation };
}

// Dispatcher function to route answers to the appropriate scoring function
function scoreAssessment(type, answers) {
    if (!Array.isArray(answers)) return { score: 0, interpretation: 'invalid answers' };
    switch (type) {
        case 'PHQ-9': return scorePHQ(answers);
        case 'GAD-7': return scoreGAD7(answers);
        case 'GHQ': return scoreGHQ(answers);
        default: return { score: 0, interpretation: 'unknown assessment type' };
    }
}

export { scoreAssessment, scorePHQ, scoreGAD7, scoreGHQ };