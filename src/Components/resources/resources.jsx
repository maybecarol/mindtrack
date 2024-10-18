import React from 'react';
import './Resources.css'; // Make sure to create this CSS file
import Navbar from '../navbar';

const disordersData = [
    {
        title: "Depression",
        description: "Depression is a common but serious mood disorder that affects how you feel, think, and handle daily activities. It causes persistent feelings of sadness and loss of interest in previously enjoyed activities. Symptoms can vary from person to person but often include changes in appetite, sleep disturbances, fatigue, difficulty concentrating, feelings of worthlessness, and thoughts of death or suicide. Treatment typically involves therapy, medication, or a combination of both.",
        resources: [
            "National Institute of Mental Health (NIMH)",
            "DBSA - Depression and Bipolar Support Alliance",
            "Mayo Clinic - Depression"
        ]
    },
    {
        title: "Anxiety",
        description: "Anxiety disorders are a group of mental health disorders characterized by excessive fear or worry that disrupts daily functioning. Common symptoms include restlessness, rapid heartbeat, excessive sweating, and difficulty concentrating. Anxiety can manifest in various forms, including generalized anxiety disorder, panic disorder, and social anxiety disorder. Treatment may involve therapy, medication, lifestyle changes, and relaxation techniques.",
        resources: [
            "Anxiety and Depression Association of America (ADAA)",
            "NIMH Anxiety Information",
            "Mayo Clinic - Anxiety Disorders"
        ]
    },
    {
        title: "Post-Traumatic Stress Disorder (PTSD)",
        description: "Post-Traumatic Stress Disorder (PTSD) is a mental health condition that can occur after experiencing or witnessing a traumatic event, such as warfare, sexual assault, natural disasters, or serious accidents. Symptoms include flashbacks, nightmares, severe anxiety, and uncontrollable thoughts about the event. Individuals with PTSD may also experience emotional numbness and avoidance of situations that remind them of the trauma. Effective treatments include therapy (particularly cognitive-behavioral therapy) and medication.",
        resources: [
            "U.S. Department of Veterans Affairs",
            "National Center for PTSD",
            "Mayo Clinic - PTSD"
        ]
    },
    {
        title: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
        description: "Attention-Deficit/Hyperactivity Disorder (ADHD) is a neurodevelopmental disorder that affects both children and adults. It is characterized by difficulty sustaining attention, hyperactivity, and impulsive behavior. Individuals with ADHD may struggle with organizing tasks, following instructions, and completing work. While symptoms can vary, treatment options often include behavioral therapy, medication, and support strategies to help manage symptoms effectively.",
        resources: [
            "CHADD - Children and Adults with Attention-Deficit/Hyperactivity Disorder",
            "NIMH - ADHD",
            "Mayo Clinic - ADHD"
        ]
    },
    {
        title: "Bipolar Disorder",
        description: "Bipolar disorder is a mental health condition marked by extreme mood swings, including emotional highs (mania or hypomania) and lows (depression). During a manic phase, individuals may feel euphoric, full of energy, or unusually irritable, while depressive episodes can lead to feelings of sadness, hopelessness, and fatigue. Effective management of bipolar disorder often involves a combination of medication, therapy, and lifestyle changes to help stabilize mood swings.",
        resources: [
            "National Institute of Mental Health (NIMH)",
            "Mayo Clinic - Bipolar Disorder"
        ]
    },
    {
        title: "Eating Disorders",
        description: "Eating disorders are serious mental health conditions characterized by abnormal eating habits that can significantly affect health, emotions, and daily life. Common types include anorexia nervosa (characterized by restrictive eating and fear of gaining weight), bulimia nervosa (involving binge eating followed by purging), and binge-eating disorder (marked by recurrent episodes of eating large quantities of food). Treatment typically involves a multidisciplinary approach, including nutritional counseling, therapy, and medical monitoring.",
        resources: [
            "National Eating Disorders Association (NEDA)",
            "NIMH - Eating Disorders",
            "Mayo Clinic - Eating Disorders"
        ]
    },
    {
        title: "Addiction",
        description: "Addiction is a complex condition, a brain disorder manifested by compulsive substance use or engagement in behaviors despite harmful consequences. It can involve substances like alcohol, prescription medications, and illicit drugs, or behaviors like gambling. Addiction often leads to significant changes in brain chemistry and function, making recovery challenging. Treatment usually involves behavioral therapies, counseling, support groups, and sometimes medication to help manage withdrawal symptoms and cravings.",
        resources: [
            "National Institute on Drug Abuse (NIDA)",
            "Substance Abuse and Mental Health Services Administration (SAMHSA)",
            "Mayo Clinic - Addiction"
        ]
    },
    {
        title: "Postpartum Depression",
        description: "Postpartum depression (PPD) is a type of mood disorder that can affect women after childbirth. It may occur within the first few weeks after delivery but can develop up to a year later. Symptoms include severe mood swings, exhaustion, feelings of inadequacy, difficulty bonding with the baby, and intrusive thoughts. PPD can impact a mother’s ability to care for herself and her child. Treatment often includes therapy, support groups, and sometimes medication.",
        resources: [
            "Postpartum Support International",
            "NIMH - Postpartum Depression",
            "Mayo Clinic - Postpartum Depression"
        ]
    }
];

const Resources = () => {
    return (
        <>
            <Navbar />
            <div className="resources-container">
                {disordersData.map((disorder, index) => (
                    <div key={index} className="disorder-card">
                        <h2 className="disorder-title">{disorder.title}</h2>
                        <p className="disorder-description">{disorder.description}</p>
                        <h3 className="resources-heading">Resources</h3>
                        <ul className="resources-list">
                            {disorder.resources.map((resource, rIndex) => (
                                <li key={rIndex} className="resource-item">{resource}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Resources;
