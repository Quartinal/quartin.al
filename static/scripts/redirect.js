const prms = new URLSearchParams(window.location.search);

//because this mainly will be to redirect to my own social media accounts
const prms_key = "platform";

const possible_prms_values = [
    "youtube",
    "github",
    "discord",
];

//social media brand image
const sm_image = document.getElementById("sm_image");

if (prms.has(prms_key)) {
    const inner_key = prms.get(prms_key);

    if (inner_key && possible_prms_values.includes(inner_key))
        sm_image.classList.add(inner_key);
}