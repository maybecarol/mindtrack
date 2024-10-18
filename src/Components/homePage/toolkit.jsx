import React, { useState } from "react";
import "./toolkit.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Toolkit = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [selectedTest, setSelectedTest] = useState(null); // Manage which test is selected
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const [answers, setAnswers] = useState({}); // Track answers for each question
  const [errors, setErrors] = useState({}); // Track errors for validation
  const [result, setResult] = useState(null); // To store the result of the test
  const [recommendation, setRecommendation] = useState(""); // To store the recommendation based on results
  const [suggestion, setSuggestion] = useState(""); // To store the suggestion based on results

  const suggestionRoutes = {
    "Connect with a therapist": "/connect-therapist",
    "Engage in Journaling": "/journaling",
    "Play calming games": "/games",
    "Try Journaling": "/journaling",
    "Listen to soothing music": "/music",
    "Play relaxing games": "/games",
    "Continue Mood Tracking": "/mood-tracking",
    "Explore music": "/music",
    "Play games": "/games",
    "Consider connecting with therapists for check-ins": "/connect-therapist",
  };

  const testQuestions = {
    depression: [
      "Do you feel sad or empty?",
      "Have you lost interest in activities you once enjoyed?",
      "Do you have trouble sleeping or sleep too much?",
      "Do you feel tired or have little energy?",
      "Do you struggle to concentrate or make decisions?",
      "Do you experience feelings of worthlessness or excessive guilt?",
      "Do you have thoughts of death or suicide?",
      "Do you feel restless or slowed down physically?",
      "Have you experienced significant weight changes without trying?",
      "Do you find it difficult to experience joy or pleasure in life?",
    ],
    anxiety: [
      "Do you often feel nervous or anxious?",
      "Do you struggle to control your worry?",
      "Do you feel restless, wound-up, or on edge?",
      "Do you get easily fatigued?",
      "Do you have difficulty concentrating or does your mind go blank?",
      "Do you have muscle tension or frequent headaches?",
      "Do you experience irritability even over small issues?",
      "Do you have trouble falling or staying asleep due to worry?",
      "Do you feel a sense of impending danger or panic?",
      "Do you avoid social situations due to fear or worry?",
    ],
    PTSD: [
      "Do you have recurring, unwanted memories of a traumatic event?",
      "Do you avoid places or situations that remind you of the trauma?",
      "Do you have trouble sleeping or experience nightmares?",
      "Do you feel detached or estranged from others?",
      "Do you experience flashbacks, as if the traumatic event is happening again?",
      "Do you find yourself easily startled or on high alert?",
      "Do you struggle with feelings of guilt or shame related to the trauma?",
      "Do you avoid talking about the traumatic event?",
      "Do you experience emotional numbness or difficulty experiencing positive emotions?",
      "Do you find it hard to concentrate or remember details of daily tasks?",
    ],
    eatingDisorder: [
      "Do you have concerns about your body weight or shape?",
      "Do you often restrict food intake or binge eat?",
      "Do you use food as a way to cope with stress or emotions?",
      "Do you feel guilty or ashamed after eating?",
      "Do you frequently check your weight or body in the mirror?",
      "Do you avoid eating in front of others?",
      "Do you engage in excessive exercise to control your weight?",
      "Do you experience fluctuations in your weight over short periods?",
      "Do you often feel out of control when eating?",
      "Do you fear gaining weight, even if others think you are thin?",
    ],
    bipolar: [
      "Do you experience extreme mood swings?",
      "Do you have periods of high energy followed by low energy?",
      "Do you feel overly happy or excited for no apparent reason?",
      "Do you experience racing thoughts or have trouble focusing?",
      "Do you engage in risky behaviors during mood highs (e.g., spending sprees)?",
      "Do you feel irritable or agitated during your highs?",
      "Do you experience prolonged periods of sadness or hopelessness?",
      "Do you have trouble sleeping, or do you sleep excessively during mood shifts?",
      "Do your mood swings interfere with your relationships or daily life?",
      'Do you feel like you are "on top of the world" one moment, but deeply depressed the next?',
    ],
    ADHD: [
      "Do you find it difficult to stay focused or organized?",
      "Do you act impulsively or struggle to sit still?",
      "Do you find yourself easily distracted by external stimuli?",
      "Do you frequently interrupt others during conversations or activities?",
      "Do you struggle to follow through on tasks or instructions?",
      "Do you often feel restless or fidgety, even in situations where it is inappropriate?",
      "Do you procrastinate or have trouble starting tasks that require focus?",
      "Do you lose important items frequently, such as keys or phones?",
      'Do you struggle with time management and often feel "behind schedule"?',
      "Do you avoid tasks that require prolonged mental effort, like reading or writing?",
    ],
    addiction: [
      "Do you find it hard to stop using a substance once you start?",
      "Have you tried to cut down on the use of alcohol or drugs but failed?",
      "Do you use the substance more often or in larger amounts than you intended?",
      "Do you spend a lot of time thinking about or recovering from substance use?",
      "Have you given up activities you once enjoyed in favor of using substances?",
      "Do you continue using a substance despite knowing it causes problems in your life?",
      "Do you experience cravings or strong urges to use the substance?",
      "Do you need to use more of the substance to get the same effect (tolerance)?",
      "Do you experience withdrawal symptoms when not using the substance?",
      "Do you find that your substance use has negatively impacted your relationships or work?",
    ],
    postpartum: [
      "Do you feel overwhelmed or hopeless since giving birth?",
      "Do you have trouble bonding with your baby?",
      "Do you feel excessively worried about your baby’s well-being?",
      "Do you experience mood swings or frequent crying?",
      "Do you have trouble sleeping, even when your baby is asleep?",
      "Do you feel like you are not a good enough mother?",
      "Do you have thoughts of harming yourself or your baby?",
      "Do you feel detached from your baby or those around you?",
      "Do you experience irritability or anger more than usual?",
      "Do you have trouble enjoying activities you used to find pleasurable?",
    ],
  };

  const options = ["Always", "Often", "Sometimes", "Never"];

  const openModal = (test) => {
    setSelectedTest(test);
    setAnswers({}); // Reset answers when a new test is selected
    setErrors({}); // Reset errors
    setIsModalOpen(true);
    setResult(null); // Reset result when opening the modal
    setRecommendation(""); // Reset recommendation when opening the modal
    setSuggestion(""); // Reset suggestion when opening the modal
  };

  const closeModal = () => {
    setSelectedTest(null);
    setIsModalOpen(false);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value,
    });
    setErrors({
      ...errors,
      [questionIndex]: false,
    });
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validate that each question has an answer
    testQuestions[selectedTest].forEach((_, index) => {
      if (!answers[index]) {
        newErrors[index] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please answer all the questions.");
    } else {
      // Define the score weights for each answer
      const weights = {
        Always: 3,
        Often: 2,
        Sometimes: 1,
        Never: 0,
      };

      // Calculate the total score based on the selected answers
      const score = Object.values(answers).reduce((total, answer) => total + weights[answer], 0);

      let resultMessage = "";
      let recommendation = "";
      let suggestions = [];

      // Define result messages and suggestions based on the total score
      if (score >= 20) {
        resultMessage = "High concern detected.";
        recommendation = "We recommend seeking professional help. We suggest the following activities:";
        suggestions = ["Connect with a therapist", "Engage in Journaling", "Play calming games"];
      } else if (score >= 10) {
        resultMessage = "Moderate concern detected.";
        recommendation = "Consider discussing your feelings with a trusted friend or family member. We suggest the following activities:";
        suggestions = ["Try Journaling", "Listen to soothing music", "Play relaxing games"];
      } else {
        resultMessage = "Low concern detected.";
        recommendation = "Keep monitoring your mental health and maintain a balanced lifestyle. We suggest the following activities:";
        suggestions = ["Continue Mood Tracking", "Explore music", "Play games", "Consider connecting with therapists for check-ins"];
      }

      // Store the result and suggestion
      setResult(resultMessage);
      setRecommendation(recommendation);
      setSuggestion(suggestions);
    }
  };

  const renderForm = (test) => {
    if (!test) return null;

    // Check if the form has been submitted
    if (result && suggestion) {
      return (
        <div className="result">
          <h2>Results for {test.charAt(0).toUpperCase() + test.slice(1)} Test</h2>
          <p>{result}</p>
          <p>{recommendation}</p>
          <ul>
            {suggestion.map((s, index) => (
              <li key={index}>
                <button onClick={() => navigate(suggestionRoutes[s])}>{s}</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="form">
        <h2 style={{ display: "flex", justifyContent: "center" }}>{`${test.charAt(0).toUpperCase() + test.slice(1)} Test`}</h2>
        {testQuestions[test].map((question, index) => (
          <div key={index} className="form-group">
            <label>{question}</label>
            <div className="options">
              {options.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors[index] && <label className="error">Please select an option.</label>}
          </div>
        ))}
        <div className="submit-button">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    );
  };

  return (
    <section className="toolkit">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover={false}
      />

      <h1>Personalized Tests</h1>
      <p>
        Pinpoint areas of your mental health that need attention by taking our
        free tests.
      </p>
      <div className="toolkit-cards">
        {Object.keys(testQuestions).map((test) => (
          <div className="card" key={test}>
            <h3>
              <Link to={`../resources`} className="links">
                {`${test.charAt(0).toUpperCase() + test.slice(1)} Test`}
              </Link>
            </h3>
            <p>
              {test === "depression"
                ? "Identify persistent feelings of sadness, loss of interest, and fatigue that could signal depression."
                : test === "anxiety"
                  ? "Recognize constant worry, nervousness, and tension that may indicate an anxiety disorder."
                  : test === "PTSD"
                    ? "Understand the impact of trauma-related flashbacks, nightmares, and hypervigilance associated with Post Traumatic Stress Disorder (PTSD)."
                    : test === "eatingDisorder"
                      ? "Evaluate patterns of disordered eating, body image concerns, and unhealthy behaviors related to food."
                      : test === "bipolar"
                        ? "Discover signs of extreme mood swings between mania and depression that characterize bipolar disorder."
                        : test === "ADHD"
                          ? "Spot difficulties with attention, hyperactivity, and impulsiveness that may suggest Attention Deficit/Hyperactivity Disorder (ADHD)."
                          : test === "addiction"
                            ? "Identify patterns of substance use, cravings, and withdrawal that could point to addiction."
                            : test === "postpartum"
                              ? "Explore signs of overwhelming sadness, detachment, and mood swings that may signal postpartum depression."
                              : ""}
            </p>
            <button onClick={() => openModal(test)}>Take the Test</button>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            {renderForm(selectedTest)}
          </div>
        </div>
      )}
    </section>
  );
};

export default Toolkit;
