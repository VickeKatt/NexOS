function updateTime() {
    var datetime = new Date().toLocaleString().replace(",", "");
    document.getElementById("datetime").textContent = datetime;
}

updateTime();
setInterval(updateTime, 1000);

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

var welcomeScreenClose = document.querySelector("#welcomeclose");
var terminalScreenClose = document.querySelector("#terminalclose");

dragElement(welcomeScreen);
dragElement(terminalScreen);

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
}

welcomeScreenClose.addEventListener("click", function() {
    closeWindow(welcomeScreen);
});

terminalScreenClose.addEventListener("click", function() {
    closeWindow(terminalScreen);
});

document.querySelector("#welcomeopen").addEventListener("dblclick", function() {
    openWindow(welcomeScreen);
});

document.querySelector("#terminal").addEventListener("dblclick", function() {
    openWindow(terminalScreen);
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

var terminalInput = document.querySelector("#terminalinput");
var terminalOutput = document.querySelector("#terminaloutput");

terminalInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        var command = terminalInput.value.trim();

        terminalOutput.innerHTML +=
            '<div><span class="prompt">viktor@nexos:~$</span> ' +
            command +
            '</div>';

        runCommand(command);

        terminalInput.value = "";
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
</div>`;
    }

    else if (command === "clear") {
        terminalOutput.innerHTML = "";
    }

    else if (command === "whoami") {
        terminalOutput.innerHTML += "<div>user</div>";
    }

    else if (command === "pwd") {
        terminalOutput.innerHTML += "<div>/home/user</div>";
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

    else if (command === "neofetch") {
        terminalOutput.innerHTML += `
<div'>
███╗   ██╗███████╗██╗  ██╗ ██████╗ ███████╗
████╗  ██║██╔════╝╚██╗██╔╝██╔═══██╗██╔════╝
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝

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
            "<div>Not found!</div>";
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}