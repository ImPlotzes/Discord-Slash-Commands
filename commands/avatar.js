// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "avatar",
    description: "Get your profile picture, or the one from someone else.",
    options: [
        {
            type: 6,
            name: "user",
            description: "The user who's avatar you want to see."
        }
    ]
};


// Import the utils
import { editMessage } from "../utils";


export async function handleAvatar(request, requestBody) {
    // Get the user object
    // If the user selected a user then get the user object through
    // the data, else get the user who executed the command
    let user;
    if(requestBody.data.options) {
        const userId = requestBody.data.options[0].value;
        user = requestBody.data.resolved.users[userId];
    } else {
        user = requestBody.member.user;
    }

    // Create the URL without file extension (can be GIF, PNG, etc.)
    let url;
    if(user.avatar) { // If there's no avatar then use default picture
        url = "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar;
        // If the avatar hash starts with "a_" then it's a gif
        // else it's just an image, so I choose PNG
        if(user.avatar.startsWith("a_")) {
            url += ".gif?size=1024";
        } else {
            url += ".png?size=1024";
        }
    } else {
        url = "https://cdn.discordapp.com/embed/avatars/" + user.discriminator % 5 + ".png";
    }

    let discriminator = "";
    if(user.discriminator != "0") {
        discriminator = "#" + user.discriminator;
    }

    // Now we can return the embed
    await editMessage({
        embeds: [
            {
                author: {
                    name: "Avatar"
                },
                title: user.username.replace(/_/g, "\\_") + discriminator,
                image: {
                    url: url
                },
                color: parseInt("76cc00", 16)
            }
        ]
    }, requestBody.token);
}