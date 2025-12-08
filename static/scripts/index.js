import { change_location } from "/scripts/util.js";

const sm_classes = [
    "discord",
    "github",
    "youtube",
];

for (const sm_class of sm_classes){
    const elem = document.getElementById(sm_class);

    elem.addEventListener("click", (name, value) =>{
        const url = new URL("/redirect.html", window.location.origin);

        url.searchParams.append("platform", sm_class);

        change_location(url.toString());
    });
}