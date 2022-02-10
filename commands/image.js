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

    // Get the images for that subject
    const response = await fetch("https://api.pexels.com/v1/search?query=" + encodeURIComponent(subject));

    // If the fetch wasn't successful then send their response back as to why it wasn't successful
    if(!response.ok) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't request images. Code: `" + response.status + "`",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    let imageData;
    try {
        // Try to parse the response body into a JSON object
        imageData = await response.json();
    } catch(e) {
        // For some reason the API didn't return JSON... so return an error message
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Got an unexpected internal response.",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Get the URL from a random photo
    let randomImageURL;
    try {
        randomImageURL = imageData.photos[Math.round((imageData.photos.length - 1) * Math.random())].src.medium;
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Didn't get the expected response format.",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Return the image
    await editMessage({
        embeds: [
            {
                title: subject,
                image: {
                    url: randomImageURL
                },
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);
}