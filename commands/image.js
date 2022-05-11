// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "image",
    description: "Get a random image of any subject",
    options: [
        {
            name: "subject",
            description: "The subject you would like to get an image from.",
            type: 3,
            required: true
        }
    ]
};


import { editMessage } from "../utils";


export async function handleImage(request, requestBody) {
    // Get the subject
    const subject = requestBody.data.options[0].value;

    // Define base url
    let url = "https://img-srch.glitch.me/api/imagesearch/" + encodeURIComponent(subject) + "?offset=";

    // Pick a random offset so we don't always just get one of the first 10 pictures
    let offset = Math.round(Math.random() * 10) * 10;

    // Add the offset to the url
    url += offset;

    // Get 10 random pictures of the API
    // (Added User-Agent else it will return status 403 - Forbidden)
    const response = await fetch(url, {
        headers: {
            "user-agent": "Plotzes-Commands-Discord-Bot / vX.X.X (Discord: Plotzes#8332)"
        }
    });

    // If response wasn't successful then return an error message
    if(!response.ok) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't fetch the random pictures. Code: `" + response.status + "`",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Try to parse the response body
    // If it doesn't work then return an error
    let responseBody;
    try {
        responseBody = await response.json();
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Got an unexpected response format. Try again later!",
                    color: parseInt("F12525")
                }
            ]
        }, requestBody.token);
        return;
    }

    // Pick a random picture from the response array
    const imageObject = responseBody[Math.round(Math.random() * (responseBody.length - 1))];

    // Return the embed with the URL from the object
    await editMessage({
        embeds: [
            {
                title: subject,
                url: imageObject.pageUrl,
                image: {
                    url: imageObject.url
                },
                footer: {
                    text: imageObject.alt
                },
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);
}