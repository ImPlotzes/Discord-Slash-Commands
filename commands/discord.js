// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "discord",
    description: "Get the invite link to the Discord server where you can report bugs or look at sneak peaks."
};


// Import the utils
import { editMessage } from "../utils"


export async function handleDiscord(request, requestBody) {
    // This is a static embed so we can return it right away

    await editMessage({
        embeds: [
            {
                title: "Discord invite link",
                description: "Here you go! Click the button below to join the server.\n\nIf you want to share the link easily then you can also use https://www.plotzes.ml/discord.",
                color: parseInt("76cc00", 16)
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 5,
                        label: "Join server!",
                        url: "https://discord.gg/s2WczPFXnv"
                    }
                ]
            }
        ]
    }, requestBody.token)
}