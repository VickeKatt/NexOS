function updateTime() {
    var datetime = new Date().toLocaleString().replace(",", "");
    document.getElementById("datetime").textContent = datetime;
}

updateTime();
setInterval(updateTime, 1000);

var performanceMode = localStorage.getItem("performanceMode") === "true";

function bringToFront(element) {
    var windows = document.querySelectorAll(".window");

    windows.forEach(function(window) {
        window.style.zIndex = "10";
    });

    element.style.zIndex = "20";
}

function dragElement(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;

    var header = element.querySelector(".windowheader");

    header.onmousedown = StartDragging;

    function StartDragging(e) {
        e = e || window.event;
        e.preventDefault();

        bringToFront(element);

        initialX = e.clientX;
        initialY = e.clientY;

        document.onmouseup = StopDragging;
        document.onmousemove = DragElement;
    }

    function DragElement(e) {
        e = e || window.event;
        e.preventDefault();

        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;

        initialX = e.clientX;
        initialY = e.clientY;

        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function StopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var welcomeScreen = document.querySelector("#welcomewindow");
var terminalScreen = document.querySelector("#terminalwindow");
var clockScreen = document.querySelector("#clockwindow");
var settingsScreen = document.querySelector("#settingswindow");

var welcomeScreenClose = document.querySelector("#welcomeclose");
var terminalScreenClose = document.querySelector("#terminalclose");
var clockScreenClose = document.querySelector("#clockclose");
var settingsScreenClose = document.querySelector("#settingsclose");

var terminalInput = document.querySelector("#terminalinput");
var terminalOutput = document.querySelector("#terminaloutput");

var performanceModeToggle = document.querySelector("#performanceMode");

dragElement(welcomeScreen);
dragElement(terminalScreen);
dragElement(clockScreen);
dragElement(settingsScreen);

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element, callback) {
    function open() {
        if (element.classList.contains("terminal")) {
            element.style.display = "flex";
        } else {
            element.style.display = "block";
        }

        bringToFront(element);

        if (callback) {
            callback();
        }
    }

    if (performanceMode) {
        open();
    } else {
        setTimeout(open, 250);
    }
}

welcomeScreenClose.addEventListener("click", function() {
    closeWindow(welcomeScreen);
});

terminalScreenClose.addEventListener("click", function() {
    closeWindow(terminalScreen);
});

clockScreenClose.addEventListener("click", function() {
    closeWindow(clockScreen);
});

settingsScreenClose.addEventListener("click", function() {
    closeWindow(settingsScreen);
});

document.querySelector("#welcomeopen").addEventListener("dblclick", function() {
    openWindow(welcomeScreen);
});

document.querySelector("#terminal").addEventListener("dblclick", function() {
    openWindow(terminalScreen, function() {
        terminalInput.focus();
    });
});

document.querySelector("#clock_app").addEventListener("dblclick", function() {
    openWindow(clockScreen);
});

document.querySelector("#settings_app").addEventListener("dblclick", function() {
    openWindow(settingsScreen);
});

document.querySelectorAll(".window").forEach(function(window) {
    window.addEventListener("mousedown", function() {
        bringToFront(window);
    });
});

var selectedIcon = undefined;

function selectIcon(element) {
    if (selectedIcon !== undefined) {
        selectedIcon.classList.remove("app-selected");
    }

    element.classList.add("app-selected");
    selectedIcon = element;
}

function deselectIcon(element) {
    element.classList.remove("app-selected");
    selectedIcon = undefined;
}

function handleIconTap(element) {
    if (element.classList.contains("app-selected")) {
        deselectIcon(element);
    } else {
        selectIcon(element);
    }
}

terminalInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        var command = terminalInput.value.trim();

        terminalOutput.innerHTML +=
            '<div><span class="prompt">admin@nexos:~$</span> ' +
            command +
            '</div>';

        runCommand(command);

        terminalInput.value = "";
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
});

function runCommand(command) {

    if (command === "help") {
        terminalOutput.innerHTML += `
<div>
Available commands:

help
clear
whoami
pwd
ls
neofetch
echo
date
</div>`;
    }

    else if (command === "clear") {
        terminalOutput.innerHTML = "";
    }

    else if (command === "whoami") {
        terminalOutput.innerHTML += "<div>admin</div>";
    }

    else if (command === "pwd") {
        terminalOutput.innerHTML += "<div>/home/admin</div>";
    }

    else if (command === "ls") {
        terminalOutput.innerHTML += `
<div>
Desktop
Documents
Downloads
NexOS
</div>`;
    }

    else if (command === "date") {
        terminalOutput.innerHTML +=
            "<div>" + new Date().toString() + "</div>";
    }

    else if (command === "neofetch") {
        terminalOutput.innerHTML += `
<div>
███╗   ██╗███████╗██╗  ██╗ ██████╗ ███████╗
████╗  ██║██╔════╝╚██╗██╔╝██╔═══██╗██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝

OS: NexOS
Shell: NexShell
Terminal: NexOS Terminal
</div>`;
    }

    else if (command.startsWith("echo ")) {
        var text = command.substring(5);

        terminalOutput.innerHTML +=
            "<div>" + text + "</div>";
    }

    else if (command === "") {
    }

    else {
        terminalOutput.innerHTML +=
            "<div>Command not found: " + command + "</div>";
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function updateClock() {
    var now = new Date();

    var hours = String(now.getHours()).padStart(2, "0");
    var minutes = String(now.getMinutes()).padStart(2, "0");
    var seconds = String(now.getSeconds()).padStart(2, "0");

    document.querySelector("#clockdisplay").textContent =
        hours + ":" + minutes + ":" + seconds;
}

updateClock();
setInterval(updateClock, 1000);

performanceModeToggle.checked = performanceMode;

performanceModeToggle.addEventListener("change", function() {
    performanceMode = performanceModeToggle.checked;
    localStorage.setItem("performanceMode", performanceMode);
});

document.querySelector("#barClock").addEventListener("click", function() {
    openWindow(clockScreen);
});

document.querySelector("#barNexos").addEventListener("click", function() {
    openWindow(welcomeScreen);
});

document.querySelector("#barTerminal").addEventListener("click", function() {
    openWindow(terminalScreen, function() {
        terminalInput.focus();
    });
});

document.querySelector("#barSettings").addEventListener("click", function() {
    openWindow(settingsScreen);
});

document.querySelector("#github_app").addEventListener("dblclick", function() {
    window.open("https://github.com/VickeKatt/NexOS", "_blank");
});

document.querySelector("#barGithub").addEventListener("click", function() {
    window.open("https://github.com/VickeKatt/NexOS", "_blank");
});