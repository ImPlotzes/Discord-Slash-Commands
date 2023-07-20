// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "frog",
    description: "Get a random frog picture! :D",
    options: [
        {
            type: 5,
            name: "gif",
            description: "If true, then it will return a gif."
        }
    ]
};

// Import the utils
import { editMessage } from "../utils"

export async function handleFrog(request, requestBody) {
    const url = new URL("https://duckduckgo.com/?q=frog");

    // Get the HTML of the page
    let html;
    try {
        html = await fetch(url).then(res => res.text());
    } catch(e) {
        await editMessage({
            embeds: [{
                title: "Not successful",
                description: "Something went wrong while trying to get the token.\n```\n" + e + "\n```",
                color: parseInt("F12525")
            }]
        }, requestBody.token);
        return;
    }

    // Parse the token we need from the HTML response
    let token = html.match(/<script.*?id="deep_preload_script".*?src="(.*?)"/);
    if(!token || token.length != 2) {
        await editMessage({
            embeds: [{
                title: "Not successful",
                description: "Something went wrong while trying to parse the internal token.",
                color: parseInt("F12525")
            }]
        }, requestBody.token);
        return;
    }
    token = new URL(token[1]).searchParams.get("vqd");

    // Create the correct URL to get the image
    url.pathname = "/i.js";
    url.searchParams.set("l", "us-en");
    url.searchParams.set("o", "json");
    url.searchParams.set("vqd", token);
    // If the user wants a gif then select that
    if(requestBody.data.options && requestBody.data.options[0].value) {
        url.searchParams.set("f", ",,,type:gif,,");
    } else {
        url.searchParams.set("f", ",,,");
    }
    url.searchParams.set("p", "1");
    url.searchParams.set("v7exp", "a");

    // Try to get the images
    let json;
    try {
        json = (await fetch(url, {
            headers: {
                "Authority": "duckduckgo.com",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "sec-fetch-dest": "empty",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
                "sec-fetch-site": "same-origin",
                "sec-fetch-mode": "cors",
                "referer": "https://duckduckgo.com/",
                "accept-language": "en-US,en;q=0.9"
            }
        }).then(res => res.json())).results;
    } catch(e) {
        await editMessage({
            embeds: [{
                title: "Not successful",
                description: "Something went wrong while trying to get the image.\n```\n" + e + "\n```",
                color: parseInt("F12525")
            }]
        }, requestBody.token);
        return;
    }

    // Return a message if there are no images
    if(json.length == 0) {
        await editMessage({
            embeds: [{
                title: "No images found",
                description: "No images were found for that search query, please search for something else.",
                color: parseInt("76cc00", 16)
            }]
        }, requestBody.token);
        return;
    }

    // Pick a random picture from the response array
    const imageObject = json[Math.round(Math.random() * (json.length - 1))];

    // Return the embed with the URL from the object
    await editMessage({
        embeds: [
            {
                title: "Frog",
                image: {
                    url: imageObject.image
                },
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);
}