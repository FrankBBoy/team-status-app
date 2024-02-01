// Configuration options
const teamData = {
  members: {
    Nathaniel: { position: "T1", status: "Available", optionsActive: false },
    Oswaldo: { position: "T1", status: "Available", optionsActive: false },
    Conor: { position: "T1", status: "Available", optionsActive: false },
    Ruben: { position: "T1", status: "Available", optionsActive: false },
    Tyler: { position: "T1", status: "Available", optionsActive: false },
    Brett: { position: "T1", status: "Available", optionsActive: false },
    Jeff: { position: "T3", status: "Available", optionsActive: false },
    Matt: { position: "T4", status: "Available", optionsActive: false },
    Samuel: { position: "T1", status: "Available", optionsActive: false },
    Frank: {
      position: "Supervisor",
      status: "Available",
      optionsActive: false,
    },
    // ... Add more team members as needed ...
  },
  supervisorStatusOptions: ["Available", "Break", "Lunch", "Meeting"],
  statusOptions: ["Available", "Break Stick", "Queue Maintenance", "Lunch"],
};

// Variable to store the timeout ID for the "Assisted" button background color
let assistedTimeoutId;

// Flag to track whether a status has been selected
let statusSelected = false;

// Function to initialize the team members and add event listeners
function initializeTeamMembers() {
  const buttonContainer = document.getElementById("buttonContainer");

  Object.keys(teamData.members).forEach((member) => {
    const button = document.createElement("button");
    button.id = member;
    button.className = "available";
    button.innerText = `${teamData.members[member].position} - ${
      member.charAt(0).toUpperCase() + member.slice(1)
    } - ${teamData.members[member].status}`;
    button.addEventListener("click", () => {
      if (!teamData.members[member].optionsActive) {
        displayStatusOptions(member);
      }
    });

    // Add touch event for touchscreen capability
    button.addEventListener("touchstart", (event) => {
      event.preventDefault();
      if (!teamData.members[member].optionsActive) {
        displayStatusOptions(member);
      }
    });

    buttonContainer.appendChild(button);

  });

  // Event listener for DUO button
  document.getElementById("duo").addEventListener("click", () => {
    // Interrupt the Assisted button background color change
    interruptAssistedBackgroundColorChange();
    changePageBackground("#d0f288");
  });

  document.getElementById("duo").addEventListener("touchstart", (event) => {
    event.preventDefault();
    // Interrupt the Assisted button background color change
    interruptAssistedBackgroundColorChange();
    changePageBackground("#d0f288");
  });

  // Event listener for Buzz Worthy button
  document.getElementById("buzzworthy").addEventListener("click", () => {
    // Interrupt the Assisted button background color change
    interruptAssistedBackgroundColorChange();
    changePageBackground("#fa7070");
  });

  document.getElementById("buzzworthy").addEventListener("touchstart", (event) => {
    event.preventDefault();
    // Interrupt the Assisted button background color change
    interruptAssistedBackgroundColorChange();
    changePageBackground("#fa7070");
  });

  // Event listener for Assisted button
  document.getElementById("assisted").addEventListener("click", () => {
    // Set the background color for Assisted button
    changePageBackground("#92c7cf");

    // Set a timeout to reset the background color after 7 seconds
    assistedTimeoutId = setTimeout(() => {
      document.body.style.backgroundColor = ""; // Set it to your initial color
    }, 7000);
  });

  document.getElementById("assisted").addEventListener("touchstart", (event) => {
    event.preventDefault();
    // Set the background color for Assisted button
    changePageBackground("#92c7cf");

    // Set a timeout to reset the background color after 7 seconds
    assistedTimeoutId = setTimeout(() => {
      document.body.style.backgroundColor = ""; // Set it to your initial color
    }, 7000);
  });
}

// Function to display list of available options as buttons for team members
function displayStatusOptions(member) {
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "status-buttons";

  // Determine the status options based on the member's position
  const memberStatusOptions =
    teamData.members[member].position === "Supervisor"
      ? teamData.supervisorStatusOptions
      : teamData.statusOptions;

  memberStatusOptions.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.className = "status-button";
    const optionClass = option.replace(/\s+/g, "").toLowerCase();
    optionButton.classList.add(optionClass);
    optionButton.innerText = option;
    optionButton.addEventListener("click", () => {
      updateStatus(member, option, null);
      document.body.removeChild(optionsContainer);
    });
    optionsContainer.appendChild(optionButton);
  });

  const memberButton = document.getElementById(member);
  const rect = memberButton.getBoundingClientRect();
  const isOnLeft = rect.left < window.innerWidth / 2;

  if (isOnLeft) {
    optionsContainer.style.top = `${rect.top + window.scrollY}px`;
    optionsContainer.style.right = `${
      window.innerWidth - rect.left + window.scrollX
    }px`;
  } else {
    optionsContainer.style.top = `${rect.top + window.scrollY}px`;
    optionsContainer.style.left = `${rect.right + window.scrollX}px`;
  }

  document.body.appendChild(optionsContainer);

  teamData.members[member].optionsActive = true;

  // Resets optionsActive flag after displaying options
  setTimeout(() => {
    teamData.members[member].optionsActive = false;
  }, 0);
}

// Function to display supervisor status options for any supervisor
function displaySupervisorStatusOptions(member) {
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "status-buttons";

  const supervisorStatusOptions = ["Available", "Break", "Lunch", "Meeting"];

  supervisorStatusOptions.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.className = "status-button";
    const optionClass = option.replace(/\s+/g, "").toLowerCase();
    optionButton.classList.add(optionClass); // Add class based on status

    // Set background color for "Break" and "Meeting" buttons
    if (option === "Break") {
      optionButton.style.backgroundColor = "#7BD3EA";
    } else if (option === "Meeting") {
      optionButton.style.backgroundColor = "#b99d40";
    }

    optionButton.innerText = option;
    optionButton.addEventListener("click", () => {
      updateStatus(member, option, null);
      document.body.removeChild(optionsContainer);
    });
    optionsContainer.appendChild(optionButton);
  });

  // Position the options container to the right of the supervisor's button
  const supervisorButton = document.getElementById(member);
  const rect = supervisorButton.getBoundingClientRect();
  optionsContainer.style.top = `${rect.top + window.scrollY}px`;
  optionsContainer.style.left = `${rect.right + window.scrollX}px`;

  document.body.appendChild(optionsContainer);

  // Set optionsActive flag to true
  teamMembers[member].optionsActive = true;
}

// Function to update the status
function updateStatus(member, newStatus, backgroundColor) {
  // Check if the member is a supervisor
  if (teamData.members[member].position === "Supervisor") {
    // Reset background color for supervisor button
    document.getElementById(member).style.backgroundColor = null;

    // Update the status for the supervisor
    teamData.members[member].status = newStatus;

    // Update the background color of the supervisor button to match the selected status option
    if (newStatus === "Available") {
      backgroundColor = "#0b60b0";
    } else if (newStatus === "Lunch") {
      backgroundColor = "Green";
    } else if (newStatus === "Break") {
      backgroundColor = "#7BD3EA";
    } else if (newStatus === "Meeting") {
      backgroundColor = "#b99d40";
    }

    document.getElementById(member).style.backgroundColor = backgroundColor;

    const supervisorButton = document.getElementById(member);
    supervisorButton.innerText = `${teamData.members[member].position} - ${
      member.charAt(0).toUpperCase() + member.slice(1)
    } - ${newStatus}`;
    supervisorButton.classList.remove(
      "available",
      "breakstick",
      "queuemaintenance",
      "lunch",
      "duo",
      "buzzworthy",
      "assisted"
    );
    supervisorButton.classList.add(newStatus.replace(/\s+/g, "").toLowerCase());

    // Reset optionsActive flag to false after selecting a status
    teamData.members[member].optionsActive = false;
  } else {
    // For non-supervisor members, check if the maximum number of team members on Lunch status is reached
    if (newStatus === "Lunch") {
      const lunchMembersCount = Object.values(teamData.members).filter(
        (teamMember) =>
          teamMember.status === "Lunch" && teamMember.position !== "Supervisor"
      ).length;

      if (lunchMembersCount >= 3) {
        // Display an alert message and return without updating the status
        alert(
          `3 team members on lunch, check with your Supervisor before leaving!`
        );
        return;
      }
    }
    // Check for conflicts with Break Stick status
    if (newStatus === "Break Stick") {
      const breakStickMember = Object.entries(teamData.members).find(
        ([, teamMember]) => teamMember.status === "Break Stick"
      );

      if (breakStickMember && breakStickMember[0] !== member) {
        // Display an alert message and return without updating the status
        alert(
          `${teamData.members[breakStickMember[0]].position} ${
            breakStickMember[0]
          } already has the Break Stick!`
        );
        return;
      }
    }

    // Check for conflicts with Queue Maintenance status
    if (newStatus === "Queue Maintenance") {
      const maintenanceMember = Object.entries(teamData.members).find(
        ([, teamMember]) => teamMember.status === "Queue Maintenance"
      );

      if (maintenanceMember && maintenanceMember[0] !== member) {
        // Display an alert message and return without updating the status
        alert(
          `${teamData.members[maintenanceMember[0]].position} ${
            maintenanceMember[0]
          } is currently maintaining their queue!`
        );
        return;
      }
    }

    // Reset optionsActive flag for the member
    teamData.members[member].optionsActive = false;
    // Update the status and button text for team members
    teamData.members[member].status = newStatus;
    const memberButton = document.getElementById(member);
    memberButton.innerText = `${teamData.members[member].position} - ${
      member.charAt(0).toUpperCase() + member.slice(1)
    } - ${newStatus}`;
    memberButton.classList.remove(
      "available",
      "breakstick",
      "queuemaintenance",
      "lunch",
      "duo",
      "buzzworthy",
      "assisted"
    );
    memberButton.classList.add(newStatus.replace(/\s+/g, "").toLowerCase());

    // Reset optionsActive flag to false after selecting a status
    teamData.members[member].optionsActive = false;
  }
}

// Function to change the page background color
function changePageBackground(color) {
  document.body.style.backgroundColor = color;
}

// Function to interrupt the Assisted button background color change
function interruptAssistedBackgroundColorChange() {
  // Check if the Assisted button background color change is in progress
  if (assistedTimeoutId) {
    clearTimeout(assistedTimeoutId);
  }
}

// Initialize team members and add event listeners
initializeTeamMembers();

// Event listener for DUO button
document.getElementById("duo").addEventListener("click", () => {
  changePageBackground("#d0f288");
});

document.getElementById("duo").addEventListener("touchstart", (event) => {
  event.preventDefault();
  changePageBackground("#d0f288");
});

// Event listener for Buzz Worthy button
document.getElementById("buzzworthy").addEventListener("click", () => {
  changePageBackground("#fa7070");
});

document.getElementById("buzzworthy").addEventListener("touchstart", (event) => {
  event.preventDefault();
  changePageBackground("#fa7070");
});

// Event listener for Assisted button
document.getElementById("assisted").addEventListener("click", () => {
  changePageBackground("#92c7cf");

  // Set a timeout to reset the background color after 7 seconds only if a status is selected
  if (statusSelected) {
    assistedTimeoutId = setTimeout(() => {
      document.body.style.backgroundColor = ""; // Set it to your initial color
      statusSelected = false;
    }, 7000);
  }
});

document.getElementById("assisted").addEventListener("touchstart", (event) => {
  event.preventDefault();
  changePageBackground("#92c7cf");

  // Set a timeout to reset the background color after 7 seconds only if a status is selected
  if (statusSelected) {
    assistedTimeoutId = setTimeout(() => {
      document.body.style.backgroundColor = ""; // Set it to your initial color
      statusSelected = false;
    }, 7000);
  }
});

