// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "frog",
    description: "Get a random frog picture! :D",
};

// Import the utils
import { editMessage } from "../utils"

export async function handleFrog(request, requestBody) {
    // Define base url
    let url = "https://img-srch.glitch.me/api/imagesearch/frog?offset=";

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
                    description: "Uhh this is frogward... I can't seem to get a picture. Try again later!\n```\n" + response.statusText + "\n```",
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
                    description: "Got an unexpected response. Try again later!",
                    color: parseInt("F12525")
                }
            ]
        }, requestBody.token);
        return;
    }

    // Pick a random picture from the response array
    const frogObject = responseBody[Math.round(Math.random() * (responseBody.length - 1))];

    // Return the embed with the URL from the object
    await editMessage({
        embeds: [
            {
                title: "Frog",
                image: {
                    url: frogObject.url
                },
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);
}