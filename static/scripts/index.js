import { default as ghCat } from "./confetti/paths/ghCat.js";
import { default as yt } from "./confetti/paths/yt.js";

function randomInRange(min, max){
  return Math.random() * (max - min) + min;
}

const ghcShape = confetti.shapeFromPath({ path: ghCat, matrix: [1, 0, 0, 1, -35, -35] });
const ytShape = confetti.shapeFromPath({ path: yt });

/// Start Confetti Config ///
function genConfettiCfg(id){
    const keysInParity = {
        angle: randomInRange(68, 112),
        spread: randomInRange(63, 87),
        particleCount: randomInRange(60, 120),
        origin: { 
            y: 0.4,
        },
    };

    switch (id){
        case "gh":
            return { ...keysInParity, shapes: [ghcShape], colors: ["#000000"] };
        case "yt":
            return { ...keysInParity, shapes: [ytShape], colors: ["#FF0000"] };
        default:
            return {};
    }
}
/// End Confetti Config ///

const btnImgs = ["yt", "gh"].map(id => document.getElementById(id)).filter(Boolean);

for (const img of btnImgs){
    img.addEventListener("mousedown", () => {
        confetti(genConfettiCfg(img.id));
    });
}

// Stub
function isFirstVisit(){
}

/// START aos Init ///

const aosConfig = {
    animatedClassName: "aos-animate",
    startEvent: "DOMContentLoaded",
    offset: 20,
};

AOS.init(aosConfig);

/// END aos Init ///

function toggleScrollLocked(trueOrFalse = true){
    const className = "scroll-locked";

    const list = document.body.classList;

    if (!trueOrFalse){
        if (list.contains(className)){
            list.remove(className);
        }

        return;
    }

    list.add(className);
}

document.addEventListener("aos:in", ({ detail: element }) => {
    toggleScrollLocked(true);

    if (element.id === "navigation"){
        setTimeout(() => {
            toggleScrollLocked(false);
        }, element.dataset.aosDuration ?? 1500);
    }
});

document.addEventListener("aos:out", () => toggleScrollLocked(false));