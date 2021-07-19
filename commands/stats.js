// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "stats",
    description: "Get the TNT Games stats of any user.",
    options: [
        {
            name: "username",
            description: "The username of the player who's stats you want. (You can also use their UUID)",
            type: 3,
            required: true
        }
    ]
};


export async function handleStatsCommand(request, requestBody) {
    // Get the user (this can be their name OR their UUID)
    const user = requestBody.data.options[0].value;
    let username;
    let uuid;

    // If the user is a name (16 characters or less) then first get their UUID
    if(user.length <= 16) {
        // Try to get the account data
        const accountRes = await fetch("https://api.ashcon.app/mojang/v1/user/" + user);
        let accountData = await accountRes.text();

        // If the fetch wasn't successful then send their response back as to why it wasn't successful
        if(!response.ok) {
            return {
                embeds: [
                    {
                        title: accountData,
                        color: parseInt("F12525", 16)
                    }
                ]
            };
        }

        // Turn the response text into a JSON object
        accountData = JSON.parse(accountData);

        // Get their username (with correct capital letters) and UUID
        username = accountData.username;
        uuid = accountData.uuid;
    }

    return {
        embeds: [

        ]
    }
}