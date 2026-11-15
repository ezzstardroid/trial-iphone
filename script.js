
const screens = ["boot", "lock", "home", "appScreen", "power"];

let passcode = "1234";
let entered = "";
let battery = 100;
let note = "";

function showScreen(name) {
  screens.forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  document.getElementById(name).classList.remove("hidden");
}

function updateTime() {
  const now = new Date();

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  document.getElementById("clock").textContent = time;
  document.getElementById("lockTime").textContent = time;
  document.getElementById("homeTime").textContent = time;
  document.getElementById("date").textContent = date;
  document.getElementById("homeDate").textContent = date;
}

setInterval(updateTime, 1000);
updateTime();

// STARTUP
showScreen("boot");

setTimeout(() => {
  showScreen("lock");
}, 3000);

// PASSCODE
function key(number) {
  if (entered.length >= 4) return;

  entered += number;
  updateDots();

  if (entered.length === 4) {
    setTimeout(() => {
      if (entered === passcode) {
        entered = "";
        document.getElementById("error").textContent = "";
        showScreen("home");
      } else {
        entered = "";
        document.getElementById("error").textContent =
          "Incorrect Passcode";
      }

      updateDots();
    }, 250);
  }
}

function erase() {
  entered = entered.slice(0, -1);
  updateDots();
}

function updateDots() {
  document.getElementById("dots").textContent =
    "● ".repeat(entered.length) +
    "○ ".repeat(4 - entered.length);
}

// OPEN APPLICATIONS
function openApp(name) {
  document.getElementById("appTitle").textContent = name;

  const content = document.getElementById("appContent");

  if (name === "Notes") {
    content.innerHTML = `
      <h2>Notes</h2>
      <textarea id="noteText" rows="10"
      placeholder="Write something..."></textarea>
      <button onclick="saveNote()">Save Note</button>
    `;
    document.getElementById("noteText").value = note;
  }

  else if (name === "Safari") {
    content.innerHTML = `
      <h2>Safari</h2>
      <p>Search the internet</p>
      <input id="website"
      placeholder="Enter website address">
      <button onclick="browse()">Go</button>
      <p>Websites open in a new browser tab.</p>
    `;
  }

  else if (name === "Settings") {
    content.innerHTML = `
      <h2>Settings</h2>
      <p>Battery: ${battery}%</p>
      <button onclick="charge()">Charge Battery</button>
      <h3>Passcode</h3>
      <input id="newPass"
      type="password" maxlength="4"
      placeholder="New 4-digit passcode">
      <button onclick="changePass()">Change Passcode</button>
      <p>Device: iPhone Simulator</p>
      <p>Orientation: Portrait</p>
    `;
  }

  else if (name === "Photos") {
    content.innerHTML = `
      <h2>Photos</h2>
      <p>Your photo library is empty.</p>
      <p>📷 No photos yet</p>
    `;
  }

  else if (name === "Music") {
    content.innerHTML = `
      <h2>Music</h2>
      <p>♫ Your music library</p>
      <p>No music added yet.</p>
    `;
  }

  else {
    content.innerHTML = `
      <h2>${name}</h2>
      <p>Welcome to ${name}.</p>
    `;
  }

  showScreen("appScreen");
}

function saveNote() {
  note = document.getElementById("noteText").value;
  alert("Note saved!");
}

function browse() {
  let address = document.getElementById("website").value.trim();

  if (!address) return;

  if (!/^https?:\/\//i.test(address)) {
    address = "https://" + address;
  }

  try {
    const url = new URL(address);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid URL");
    }

    window.open(url.href, "_blank", "noopener");
  } catch {
    alert("Invalid website address");
  }
}

function changePass() {
  const value = document.getElementById("newPass").value;

  if (!/^\d{4}$/.test(value)) {
    alert("Enter exactly 4 digits.");
    return;
  }

  passcode = value;
  alert("Passcode changed!");
}

function charge() {
  battery = 100;
  updateBattery();
}

function updateBattery() {
  document.getElementById("battery").textContent =
    battery + "%";
}

setInterval(() => {
  if (battery > 0) {
    battery--;
    updateBattery();
  }
}, 60000);

// NAVIGATION
function goHome() {
  showScreen("home");
}

function powerMenu() {
  showScreen("power");
}

function closePower() {
  showScreen("home");
}

function restart() {
  showScreen("boot");

  setTimeout(() => {
    entered = "";
    updateDots();
    showScreen("lock");
  }, 3000);
}

function shutdown() {
  showScreen("boot");
  document.querySelector(".boot p").textContent =
    "Device is shutting down...";

  setTimeout(() => {
    document.querySelector(".boot p").textContent =
      "Device is off";
  }, 1500);
    }
