// Object to store team members and their positions
const teamMembers = {
  conor: { position: "T1", status: "Available", optionsActive: false },
  tyler: { position: "T1", status: "Available", optionsActive: false },
  ruben: { position: "T1", status: "Available", optionsActive: false },
  oswaldo: { position: "T1", status: "Available", optionsActive: false },
  nathaniel: { position: "T1", status: "Available", optionsActive: false },
  brett: { position: "T2", status: "Available", optionsActive: false },
  jeff: { position: "T3", status: "Available", optionsActive: false },
  matt: { position: "T4", status: "Available", optionsActive: false },
  samuel: { position: "T1", status: "Available", optionsActive: false },
  frank: { position: "Supervisor", status: "Available", optionsActive: false },
};

// Status options for team members
const statusOptions = [
  "Available",
  "Break Stick",
  "Queue Maintenance",
  "Lunch",
];

// Supervisor status options
const supervisorStatusOptions = ["Available", "Break", "Lunch", "Meeting"];

// Event listener for each member button
Object.keys(teamMembers).forEach((member) => {
  document.getElementById(member).addEventListener("click", () => {
    // Display list of available options as buttons if options are not already active
    if (!teamMembers[member].optionsActive) {
      displayStatusOptions(member);
    }
  });
});

// Event listener for DUO button
document.getElementById("duo").addEventListener("click", () => {
  changePageBackground("#D0F288");
});

// Event listener for Buzz Worthy button
document.getElementById("buzzworthy").addEventListener("click", () => {
  changePageBackground("#FA7070");
});

// Event listener for Assisted button
document.getElementById("assisted").addEventListener("click", () => {
  changePageBackground("#92C7CF");
});

// Event listener for Supervisor button
document.getElementById("frank").addEventListener("click", () => {
  // Display supervisor status options for Frank only if options are not already active
  if (!teamMembers.frank.optionsActive) {
    displaySupervisorStatusOptions("frank");
  }
});

// Function to display list of available options as buttons for team members
function displayStatusOptions(member) {
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "status-buttons";

  // Determine the status options based on the member's position
  const memberStatusOptions =
    teamMembers[member].position === "Supervisor"
      ? supervisorStatusOptions
      : statusOptions;

  memberStatusOptions.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.className = "status-button";
    const optionClass = option.replace(/\s+/g, "").toLowerCase();
    optionButton.classList.add(optionClass); // Add class based on status
    optionButton.innerText = option;
    optionButton.addEventListener("click", () => {
      updateStatus(member, option, null);
      document.body.removeChild(optionsContainer);
    });
    optionsContainer.appendChild(optionButton);
  });

  // Position the options container to the left or right of the member's button based on its position
  const memberButton = document.getElementById(member);
  const rect = memberButton.getBoundingClientRect();

  // Check if the member is on the left side of the grid
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

  // Set optionsActive flag to true
  teamMembers[member].optionsActive = true;
}

// Function to display supervisor status options for Frank
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
  if (teamMembers[member].position === "Supervisor") {
    // For supervisor, do not change the page background
    backgroundColor = null;

    // Check for specific background colors for "Break" and "Meeting" buttons
    if (newStatus === "Break") {
      backgroundColor = "#7BD3EA";
    } else if (newStatus === "Meeting") {
      backgroundColor = "#b99d40";
    }

    // Update the background color of the supervisor's button
    document.getElementById(member).style.backgroundColor = backgroundColor;
  } else {
    // For non-supervisor members, update the page background color only for specific buttons
    if (member === "duo" || member === "buzzworthy" || member === "assisted") {
      document.body.style.backgroundColor = backgroundColor;
    }
  }

  // Check if a member is already on "Break Stick" status
  const breakStickOccupied = Object.entries(teamMembers).find(
    ([key, value]) => value.status === "Break Stick" && key !== member
  );

  // Check if a member is already on "Queue Maintenance" status
  const queueMaintenanceOccupied = Object.entries(teamMembers).find(
    ([key, value]) => value.status === "Queue Maintenance" && key !== member
  );

  // Check if the maximum number of members on "Lunch" has been reached
  const lunchOccupied =
    Object.entries(teamMembers).filter(
      ([key, value]) => value.status === "Lunch"
    ).length >= 3;

  // Check if the member's status conflicts with the rules
  if (
    (newStatus === "Break Stick" && breakStickOccupied) ||
    (newStatus === "Queue Maintenance" &&
      queueMaintenanceOccupied &&
      teamMembers[member].position !== "Supervisor")
  ) {
    alert(
      `Sorry, ${
        breakStickOccupied ? breakStickOccupied[0] : queueMaintenanceOccupied[0]
      } is already on ${newStatus} status.`
    );
    newStatus = "Available"; // Reset to Available status in case of conflict
  }

  // Check if the member's status conflicts with the lunch rule
  if (newStatus === "Lunch" && lunchOccupied) {
    alert(
      `Sorry, the maximum number of team members on lunch has been reached. Lunch is already taken by ${lunchOccupied
        .map(([key, value]) => key)
        .join(", ")}.`
    );
    return;
  }

  // Update the status and button text
  teamMembers[member].status = newStatus;

  if (member === "duo" || member === "buzzworthy" || member === "assisted") {
    // Update DUO, Buzz Worthy, and Assisted buttons
    document.getElementById(member).innerText = `${newStatus}`;
  } else {
    // Update the member button text
    document.getElementById(member).innerText = `${
      teamMembers[member].position
    } - ${member.charAt(0).toUpperCase() + member.slice(1)} - ${newStatus}`;
  }

  // Update the background color of the member button based on the status
  const memberButton = document.getElementById(member);
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
  teamMembers[member].optionsActive = false;
}

// Function to change the page background color
function changePageBackground(color) {
  document.body.style.backgroundColor = color;

  // Check if the color is being set to the initial color after clicking "Assisted" button
  if (color === "#92C7CF") {
    // Reset the background color to the initial color after 7 seconds
    setTimeout(() => {
      document.body.style.backgroundColor = ""; // Set it to your initial color
    }, 7000);
  }
}
