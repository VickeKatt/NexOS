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
    const size = document.querySelector("#drawsize");
    const sizeValue = document.querySelector("#drawsizevalue");
    const undoButton = document.querySelector("#drawundo");
    const redoButton = document.querySelector("#drawredo");
    const clearButton = document.querySelector("#drawclear");
    const openButton = document.querySelector("#drawopen");
    const saveButton = document.querySelector("#drawsave");
    const fileInput = document.querySelector("#drawfile");

    // Custom color picker
    const colorButton = document.querySelector("#drawcolorbutton");
    const colorPanel = document.querySelector("#drawcolorpanel");
    const colorClose = document.querySelector("#drawcolorclose");
    const colorPreview = document.querySelector("#drawcolorpreview");
    const colorLargePreview = document.querySelector("#drawcolorlargepreview");
    const colorLabel = document.querySelector("#drawcolorlabel");
    const colorName = document.querySelector("#drawcolorname");
    const hexInput = document.querySelector("#drawhex");
    const hexApply = document.querySelector("#drawhexapply");
    const hueInput = document.querySelector("#drawhue");
    const saturationBox = document.querySelector("#drawsv");
    const saturationCursor = document.querySelector("#drawsvcursor");
    const palette = document.querySelector("#drawpalette");

    let selectedColor = "#000000";
    let hue = 0;
    let saturation = 0;
    let brightness = 0;
    let pickingColor = false;

    const undoStack = [];
    const redoStack = [];
    const maxHistory = 30;

    let drawing = false;
    let start = null;
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
        ctx.strokeStyle = tool.value === "eraser" ? "#ffffff" : selectedColor;
    }

    function drawShape(from, to) {
        ctx.beginPath();

        if (tool.value === "line") {
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        } else if (tool.value === "rect") {
            ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
        } else if (tool.value === "circle") {
            const rx = Math.abs(to.x - from.x) / 2;
            const ry = Math.abs(to.y - from.y) / 2;
            const cx = (from.x + to.x) / 2;
            const cy = (from.y + to.y) / 2;

            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
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

    // Convert HSV values into a HEX color.
    function hsvToHex(h, s, v) {
        s /= 100;
        v /= 100;

        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;
        let rgb;

        if (h < 60) rgb = [c, x, 0];
        else if (h < 120) rgb = [x, c, 0];
        else if (h < 180) rgb = [0, c, x];
        else if (h < 240) rgb = [0, x, c];
        else if (h < 300) rgb = [x, 0, c];
        else rgb = [c, 0, x];

        return "#" + rgb.map(value => {
            return Math.round((value + m) * 255)
                .toString(16).padStart(2, "0");
        }).join("").toUpperCase();
    }

    // Convert HEX to HSV so the picker follows palette/HEX selections.
    function hexToHsv(hex) {
        const clean = hex.replace("#", "");
        const r = parseInt(clean.slice(0, 2), 16) / 255;
        const g = parseInt(clean.slice(2, 4), 16) / 255;
        const b = parseInt(clean.slice(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        let h = 0;

        if (delta !== 0) {
            if (max === r) h = 60 * (((g - b) / delta) % 6);
            else if (max === g) h = 60 * ((b - r) / delta + 2);
            else h = 60 * ((r - g) / delta + 4);
        }

        if (h < 0) h += 360;

        return {
            h,
            s: max === 0 ? 0 : delta / max * 100,
            v: max * 100
        };
    }

    function colorDescription(hex) {
        const known = {
            "#000000": "Black",
            "#FFFFFF": "White",
            "#FF3B30": "Red",
            "#FF9500": "Orange",
            "#FFCC00": "Yellow",
            "#34C759": "Green",
            "#00C7BE": "Turquoise",
            "#007AFF": "Blue",
            "#5856D6": "Purple",
            "#AF52DE": "Violet",
            "#FF2D55": "Pink",
            "#795548": "Brown",
            "#808080": "Gray",
            "#A8E6CF": "Mint",
            "#FADADD": "Pastel pink",
            "#87CEEB": "Sky blue"
        };

        return known[hex] || "Custom color";
    }

    function updateColorUI() {
        selectedColor = hsvToHex(hue, saturation, brightness);

        colorPreview.style.backgroundColor = selectedColor;
        colorLargePreview.style.backgroundColor = selectedColor;
        colorName.textContent = colorDescription(selectedColor);
        colorLabel.textContent = selectedColor;
        hexInput.value = selectedColor.slice(1);

        saturationBox.style.backgroundColor = "hsl(" + hue + ", 100%, 50%)";
        saturationCursor.style.left = saturation + "%";
        saturationCursor.style.top = (100 - brightness) + "%";

        palette.querySelectorAll("button").forEach(button => {
            const active = button.dataset.color.toUpperCase() === selectedColor;
            button.classList.toggle("active", active);
        });
    }

    function setColor(hex) {
        const clean = hex.trim().replace(/^#/, "");

        if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
            hexInput.setCustomValidity("Enter a valid six-digit HEX color.");
            hexInput.reportValidity();
            return;
        }

        hexInput.setCustomValidity("");

        const normalized = "#" + clean.toUpperCase();
        const hsv = hexToHsv(normalized);

        hue = hsv.h;
        saturation = hsv.s;
        brightness = hsv.v;

        hueInput.value = hue;
        updateColorUI();
    }

    function updateFromSaturationPointer(event) {
        const rect = saturationBox.getBoundingClientRect();

        saturation = Math.max(0, Math.min(
            100, (event.clientX - rect.left) / rect.width * 100
        ));

        brightness = 100 - Math.max(0, Math.min(
            100, (event.clientY - rect.top) / rect.height * 100
        ));

        updateColorUI();
    }

    colorButton.addEventListener("click", function(event) {
        event.stopPropagation();

        const opening = colorPanel.hidden;
        colorPanel.hidden = !opening;
        colorButton.setAttribute("aria-expanded", String(opening));
    });

    colorClose.addEventListener("click", function() {
        colorPanel.hidden = true;
        colorButton.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("pointerdown", function(event) {
        if (!colorPanel.hidden &&
            !colorPanel.contains(event.target) &&
            !colorButton.contains(event.target)) {
            colorPanel.hidden = true;
            colorButton.setAttribute("aria-expanded", "false");
        }
    });

    hueInput.addEventListener("input", function() {
        hue = Number(hueInput.value);
        updateColorUI();
    });

    saturationBox.addEventListener("pointerdown", function(event) {
        pickingColor = true;
        saturationBox.setPointerCapture(event.pointerId);
        updateFromSaturationPointer(event);
    });

    saturationBox.addEventListener("pointermove", function(event) {
        if (pickingColor) updateFromSaturationPointer(event);
    });

    saturationBox.addEventListener("pointerup", function() {
        pickingColor = false;
    });

    saturationBox.addEventListener("pointercancel", function() {
        pickingColor = false;
    });

    saturationBox.addEventListener("keydown", function(event) {
        const step = event.shiftKey ? 10 : 2;

        if (event.key === "ArrowRight") saturation = Math.min(100, saturation + step);
        else if (event.key === "ArrowLeft") saturation = Math.max(0, saturation - step);
        else if (event.key === "ArrowUp") brightness = Math.min(100, brightness + step);
        else if (event.key === "ArrowDown") brightness = Math.max(0, brightness - step);
        else return;

        event.preventDefault();
        updateColorUI();
    });

    hexApply.addEventListener("click", function() {
        setColor(hexInput.value);
    });

    hexInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            setColor(hexInput.value);
        }
    });

    hexInput.addEventListener("input", function() {
        hexInput.setCustomValidity("");
    });

    palette.addEventListener("click", function(event) {
        const button = event.target.closest("button[data-color]");
        if (!button) return;
        setColor(button.dataset.color);
    });

    // Start with black selected.
    hueInput.value = hue;
    updateColorUI();
})();
