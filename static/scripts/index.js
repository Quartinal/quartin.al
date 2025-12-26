import { change_location } from "/scripts/util.js";
import {
    fetch_projects,
    fetch_projects_np,
    fetch_projects_desc,
} from "/scripts/fetch_projects.js";

console.log("index.js loaded");

const sm_classes = [
    "discord",
    "youtube",
    "github",
];

for (const sm_class of sm_classes){
    const elem = document.getElementById(sm_class);

    elem.addEventListener("click", () =>{
        const url = new URL("/redirect.html", window.location.origin);

        url.searchParams.append("platform", sm_class);

        change_location(url.toString());
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const json = await fetch_projects();
        console.log("json:", json);

        if (!Array.isArray(json)) return;

        const prs = document.getElementById("projects");
        if (!prs) return;

        const nav = document.querySelector(".navigation");
        if (nav) {
            const rect = nav.getBoundingClientRect();
            prs.style.top = `${rect.height}px`;
        }

        const nps = fetch_projects_np(json);
        const descs = fetch_projects_desc(json);

        for (let i = 0; i < json.length; i++) {
            const div = document.createElement("div");

            const title = document.createElement("h1");
            title.className = "project_title";
            title.innerText = nps[i];

            const desc = document.createElement("p");
            desc.className = "project_desc";
            desc.innerText = descs[i];

            div.append(title, desc);
            prs.appendChild(div);
        }

        console.log("projects written to .projects");
    } catch (err) {
        console.error("write_projects_to_html failed:", err);
    }
});
