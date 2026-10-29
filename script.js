var welcomeScreen = document.querySelector("#welcomewindow");
var terminalScreen = document.querySelector("#terminalwindow");
var clockScreen = document.querySelector("#clockwindow");
var settingsScreen = document.querySelector("#settingswindow");
var nexdrawScreen = document.querySelector("#nexdrawwindow");


var welcomeScreenClose = document.querySelector("#welcomeclose");
var terminalScreenClose = document.querySelector("#terminalclose");
var clockScreenClose = document.querySelector("#clockclose");
var settingsScreenClose = document.querySelector("#settingsclose");
var nexdrawScreenClose = document.querySelector("#nexdrawclose");

var terminalInput = document.querySelector("#terminalinput");
var terminalOutput = document.querySelector("#terminaloutput");

var performanceModeToggle = document.querySelector("#performanceMode");

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

dragElement(welcomeScreen);
dragElement(terminalScreen);
dragElement(clockScreen);
dragElement(settingsScreen);
dragElement(nexdrawScreen);

function closeWindow(element) {
    element.style.display = "none";
}


function openWindow(element, callback) {
    function open() {
        if (
            element.classList.contains("terminal") ||
            element.classList.contains("nexdraw")
        ) {
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

nexdrawScreenClose.addEventListener("click", function() {
    closeWindow(nexdrawScreen);
});

document.querySelector("#nexdraw_app").addEventListener("dblclick", function() {
    openWindow(nexdrawScreen);
});

document.querySelector("#barNexDraw").addEventListener("click", function() {
    openWindow(nexdrawScreen);
});

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

const wallpaperOptions = document.querySelectorAll(".wallpaper-option");

const defaultWallpaper = "./WALLPAPERS/bg_space_dark.png";
const savedWallpaper = localStorage.getItem("nexosWallpaper");

const availableWallpapers = Array.from(wallpaperOptions)
    .map(option => option.dataset.wallpaper);

function setWallpaper(path) {
    if (!availableWallpapers.includes(path)) {
        return;
    }

    document.body.style.backgroundImage = `url("${path}")`;
    localStorage.setItem("nexosWallpaper", path);

    wallpaperOptions.forEach(option => {
        const selected = option.dataset.wallpaper === path;

        option.classList.toggle("active", selected);
        option.setAttribute("aria-pressed", String(selected));
    });
}

wallpaperOptions.forEach(option => {
    option.addEventListener("click", () => {
        setWallpaper(option.dataset.wallpaper);
    });
});

setWallpaper(
    availableWallpapers.includes(savedWallpaper)
        ? savedWallpaper
        : defaultWallpaper
);

(function initNexDraw() {
    const canvas = document.querySelector("#drawcanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const tool = document.querySelector("#drawtool");
    const color = document.querySelector("#drawcolor");
    const size = document.querySelector("#drawsize");
    const sizeValue = document.querySelector("#drawsizevalue");
    const undoButton = document.querySelector("#drawundo");
    const redoButton = document.querySelector("#drawredo");
    const clearButton = document.querySelector("#drawclear");
    const openButton = document.querySelector("#drawopen");
    const saveButton = document.querySelector("#drawsave");
    const fileInput = document.querySelector("#drawfile");

    const undoStack = [];
    const redoStack = [];
    const maxHistory = 30;

    let drawing = false;
    let start = null;
    let last = null;
    let points = [];
    let original = null;

    function fillWhite() {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    fillWhite();

    function snapshot() {
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function saveHistory() {
        undoStack.push(snapshot());

        if (undoStack.length > maxHistory) {
            undoStack.shift();
        }

        redoStack.length = 0;
    }

    function undo() {
        if (!undoStack.length) return;

        redoStack.push(snapshot());
        ctx.putImageData(undoStack.pop(), 0, 0);
    }

    function redo() {
        if (!redoStack.length) return;

        undoStack.push(snapshot());
        ctx.putImageData(redoStack.pop(), 0, 0);
    }

    function position(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height
        };
    }

    function drawLine(from, to) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    function applyStyle() {
        ctx.lineWidth = Number(size.value);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = tool.value === "eraser" ? "#ffffff" : color.value;
    }

    function drawShape(from, to) {
        ctx.beginPath();

        if (tool.value === "line") {
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        } else if (tool.value === "rect") {
            ctx.strokeRect(
                from.x,
                from.y,
                to.x - from.x,
                to.y - from.y
            );
        } else if (tool.value === "circle") {
            const rx = Math.abs(to.x - from.x) / 2;
            const ry = Math.abs(to.y - from.y) / 2;
            const cx = (from.x + to.x) / 2;
            const cy = (from.y + to.y) / 2;

            ctx.ellipse(
                cx, cy, rx, ry, 0, 0, Math.PI * 2
            );
            ctx.stroke();
        }
    }

    function redrawPreview(current) {
        ctx.putImageData(original, 0, 0);
        applyStyle();

        if (tool.value === "pen" || tool.value === "eraser") {
            for (let i = 1; i < points.length; i++) {
                drawLine(points[i - 1], points[i]);
            }
        } else {
            drawShape(start, current);
        }
    }

    canvas.addEventListener("pointerdown", function(event) {
        if (event.button !== 0) return;

        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);

        saveHistory();

        drawing = true;
        start = position(event);
        last = start;
        points = [start];
        original = snapshot();

        applyStyle();

        if (tool.value === "pen" || tool.value === "eraser") {
            drawLine(start, {
                x: start.x + 0.01,
                y: start.y + 0.01
            });
        }
    });

    canvas.addEventListener("pointermove", function(event) {
        if (!drawing) return;

        const current = position(event);

        if (tool.value === "pen" || tool.value === "eraser") {
            points.push(current);
        }

        redrawPreview(current);
        last = current;
    });

    function stopDrawing(event) {
        if (!drawing) return;

        if (event && event.type === "pointerup") {
            const current = position(event);

            if (tool.value !== "pen" && tool.value !== "eraser") {
                redrawPreview(current);
            }
        }

        drawing = false;
        start = null;
        last = null;
        points = [];
        original = null;
    }

    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);

    undoButton.addEventListener("click", undo);
    redoButton.addEventListener("click", redo);

    size.addEventListener("input", function() {
        sizeValue.textContent = size.value + " px";
    });

    clearButton.addEventListener("click", function() {
        saveHistory();
        fillWhite();
    });

    openButton.addEventListener("click", function() {
        fileInput.click();
    });

    fileInput.addEventListener("change", function() {
        const file = fileInput.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            fileInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            const image = new Image();

            image.onload = function() {
                saveHistory();
                fillWhite();

                const scale = Math.min(
                    canvas.width / image.width,
                    canvas.height / image.height
                );

                const width = image.width * scale;
                const height = image.height * scale;
                const x = (canvas.width - width) / 2;
                const y = (canvas.height - height) / 2;

                ctx.drawImage(image, x, y, width, height);
                fileInput.value = "";
            };

            image.onerror = function() {
                alert("Could not open that image.");
                fileInput.value = "";
            };

            image.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    saveButton.addEventListener("click", function() {
        canvas.toBlob(function(blob) {
            if (!blob) {
                alert("Could not export the image.");
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "nexdraw.png";
            link.click();

            setTimeout(function() {
                URL.revokeObjectURL(url);
            }, 1000);
        }, "image/png");
    });
})();
