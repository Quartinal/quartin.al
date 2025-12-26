export async function fetch_projects(){
    const resp =
        await fetch("https://api.github.com/users/Quartinal/repos", {
            method: "GET",
            headers: {
                "Accept": "application/vnd.github+json",
            },
        });

    return await resp.json();
}

export function fetch_projects_np(json){
    return json.map((item) =>{
        const np = item.full_name.split("/")[1];

        if (np.includes("-") || np.includes("_")){
            return np.split("-")
                .map((el) => capitalize_first_letter(el))
                .join("");
        }

        return np;
    });
}

export function fetch_projects_desc(json){
    return json.map((item) =>{
        const desc = item.description;

        if (desc === null){
            return "No description yet :(";
        }

        return desc;
    });
}

function capitalize_first_letter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}