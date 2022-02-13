// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "skin",
    description: "Look at the skin of a certain user.",
    options: [
        {
            name: "username",
            description: "The username of the player who's stats you want. (You can also use their UUID)",
            type: 3,
            required: true
        }
    ]
};


import { editMessage } from "../utils";


export async function handleSkin(request, requestBody) {
    // Get the user (this can be their name OR their UUID)
    const user = requestBody.data.options[0].value;

    // Try to get the account data to check if the user exists
    const accountRes = await fetch("https://api.ashcon.app/mojang/v1/user/" + user);

    // If the fetch wasn't successful then send their response back as to why it wasn't successful
    if(!accountRes.ok) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't get the UUID of `" + user + "`.\n```\n" + accountRes.statusText + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    let accountData;
    try {
        // Try to parse the response body into a JSON object
        accountData = await accountRes.json();
    } catch(e) {
        // For some reason the API didn't return JSON... so return an error message
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't get the UUID of `" + user + "`. Got an unexpected response.",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Get their UUID
    const uuid = accountData.uuid;

    // Now we can return the embed
    await editMessage({
        embeds: [
            {
                title: accountData.username,
                color: parseInt("76cc00", 16),
                author: {
                    name: "Skin Preview"
                },
                image: {
                    url: "https://www.mc-heads.net/body/" + uuid
                },
                thumbnail: {
                    url: "https://skins.plotzes.ml/face?player=" + uuid
                },
                url: "https://minerender.org/embed/skin/?skin=" + accountData.username + "&shadow=true"
            }
        ]
    }, requestBody.token);
}