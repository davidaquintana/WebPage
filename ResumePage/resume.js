document.addEventListener("DOMContentLoaded", () => {
    const resumeData = {
        contact: {
            name: "David Quintana",
            email: "dquintanajr@outlook.com",
            phone: "708.527.4618",
            github: "https://github.com/davidaquintana"
        },
        education: {
            degree: "Bachelor of Arts, Computer Science and Philosophy",
            graduation: "May 2025",
            institution: "Grinnell College, Grinnell, IA"
        },
        experience: [
            {
                title: "OEM Intern",
                company: "Cars Commerce",
                period: "June 2024– Aug 2024",
                location: "Chicago, IL",
                responsibilities: [
                    "Reviewed and analyzed auto industry and digital marketing trends.",
                    "Developed a proof of concept for program reporting and data analysis.",
                    "Assisted with the migration toward increased transactional platform capabilities.",
                    "Collaborated with cross-functional teams to identify revenue opportunities.",
                    "Presented findings and recommendations to senior management."
                ]
            },
            {
                title: "Desktop Engineer Intern",
                company: "SDI Presence",
                period: "July 2022 – Aug 2023",
                location: "Chicago, IL",
                responsibilities: [
                    "Responded to IT support incidents and prioritized/documented resolutions.",
                    "Assisted senior team members with bug investigation and resolution.",
                    "Researched new technologies and tools to improve business processes.",
                    "Developed scripts to automate routine IT support tasks.",
                    "Provided training sessions for staff on new systems and tools."
                ]
            }
        ],
        projects: [
            {
                name: "Expected Points Added (EPA) Analysis",
                description: [
                    "Developed a simplified Expected Points (EP) model using Python and pandas.",
                    "Standardized yard lines and field positions for accurate scoring analysis.",
                    "Created visualizations to display EPA by field position with Matplotlib and Seaborn."
                ]
            },
            {
                name: "Baseball Pitch Prediction",
                description: [
                    "Built a predictive analytics model using recurrent neural networks.",
                    "Developed an LSTM model in PyTorch with CUDA optimization for fast training.",
                    "Utilized Bayesian updating to refine predictions based on historical patterns."
                ]
            },
            {
                name: "Stock Price Prediction and Portfolio Optimization",
                description: [
                    "Designed a stock price prediction model using Random Forest and Gradient Boosting.",
                    "Engineered sequences for time-series predictions and optimized hyperparameters.",
                    "Achieved improved model performance for portfolio risk assessment."
                ]
            }
        ],
        skills: [
            "Microsoft Office", "AWS", "Scheme", "Java", "Python", "C",
            "JavaScript", "HTML", "CSS"
        ]
    };

    // Populate Contact Section
    const contactSection = document.querySelector("#contact");
    contactSection.innerHTML = `
        <h2>Contact</h2>
        <p><strong>Name:</strong> ${resumeData.contact.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${resumeData.contact.email}">${resumeData.contact.email}</a></p>
        <p><strong>Phone:</strong> ${resumeData.contact.phone}</p>
        <p><strong>GitHub:</strong> <a href="${resumeData.contact.github}" target="_blank">${resumeData.contact.github}</a></p>
    `;

    // Populate Education Section
    const educationSection = document.querySelector("#education");
    educationSection.innerHTML = `
        <h2>Education</h2>
        <p><strong>Degree:</strong> ${resumeData.education.degree}</p>
        <p><strong>Graduation:</strong> ${resumeData.education.graduation}</p>
        <p><strong>Institution:</strong> ${resumeData.education.institution}</p>
    `;

    // Populate Experience Section
    const experienceSection = document.querySelector("#experience");
    experienceSection.innerHTML = `
        <h2>Experience</h2>
        ${resumeData.experience.map(exp => `
            <div>
                <h3>${exp.title} at ${exp.company}</h3>
                <p><em>${exp.period} - ${exp.location}</em></p>
                <ul>${exp.responsibilities.map(task => `<li>${task}</li>`).join("")}</ul>
            </div>
        `).join("")}
    `;

    // Populate Projects Section
    const projectsSection = document.querySelector("#projects");
    projectsSection.innerHTML = `
        <h2>Projects</h2>
        ${resumeData.projects.map(proj => `
            <div>
                <h3>${proj.name}</h3>
                <ul>${proj.description.map(desc => `<li>${desc}</li>`).join("")}</ul>
            </div>
        `).join("")}
    `;

    // Populate Skills Section
    const skillsSection = document.querySelector("#skills");
    skillsSection.innerHTML = `
        <h2>Skills</h2>
        <ul>${resumeData.skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
    `;
});
