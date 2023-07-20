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
    let user = requestBody.data.options[0].value;

    // Fetch Minecraft account data
    let mojangResponse, mojangBody;
    try {
        mojangResponse = await MOJANG_API.fetch("http://botzes/v1/user?player=" + encodeURIComponent(user));
        mojangBody = await mojangResponse.json();
    } catch(e) {
        console.log(e);

        // Return an error
        await editMessage({
            embeds: [{
                title: "Not successful",
                description: "Something went wrong while trying to get the user's data.\n```\n" + e + "\n```",
                color: parseInt("F12525", 16)
            }]
        }, requestBody.token);
        return;
    }

    // Check if the response was successful
    if(mojangResponse.status != 200) {
        // Return an error
        await editMessage({
            embeds: [{
                title: "Not successful",
                description: "Something went wrong while trying to get the user's data.\n```\n" + mojangBody.error + "\n```",
                color: parseInt("F12525", 16)
            }]
        }, requestBody.token);
        return;
    }

    const username = mojangBody.username;
    const uuid = mojangBody.uuid;

    // Now we can return the embed
    await editMessage({
        embeds: [
            {
                title: username.replace(/_/g, "\\_"),
                color: parseInt("76cc00", 16),
                author: {
                    name: "Skin Preview"
                },
                image: {
                    url: "https://visage.surgeplay.com/full/832/" + uuid
                },
                thumbnail: {
                    url: "https://skins.plotzes.com/face?player=" + uuid + "&rand=" + Math.random()
                },
                url: "https://minerender.org/embed/skin/?skin=" + username + "&shadow=true"
            }
        ]
    }, requestBody.token);
}