// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "invite",
    description: "Get the link to add these commands to your own server!"
};


export function handleInvite(request, requestBody) {
    // This is a static embed so we can return it right away

    return {
        embeds: [
            {
                title: "Add these commands",
                description: "Oh my god!! Thank you for being interested to adding these commands to your own server!\n\nThe button below will open a website where you can choose to what server to add these commands.",
                color: parseInt("76cc00", 16),
                thumbnail: {
                    url: "https://media1.tenor.com/images/d076ed43f9ce9e26d71dcb74a7bd898f/tenor.gif"
                }
            }
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 5,
                        emoji: {
                            id: null,
                            name: "😊"
                        },
                        label: "Add the commands!",
                        url: "https://discord.com/api/oauth2/authorize?client_id=865321519605612554&scope=applications.commands"
                    }
                ]
            }
        ]
    };
}