// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "source",
    description: "Get a link to the GitHub repo with the source code of this bot."
};


// Import the utils
import { editMessage } from "../utils";


export async function handleSource(request, requestBody) {
    // This is just a static embed so we can return it right away

    await editMessage({
        embeds: [
            {
                title: "Source Code",
                description: "This application is open source. You can check out the GitHub repo with the source code by clicking the button below. Don't be scared to scour through the code and look for bugs.",
                color: parseInt("76cc00", 16),
                image: {
                    url: "https://repository-images.githubusercontent.com/387602281/77d1db5e-ad27-4e3e-a463-164cde00c182"
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
                        label: "Go to the GitHub repo!",
                        url: "https://github.com/ImPlotzes/Discord-Slash-Commands"
                    }
                ]
            }
        ]
    }, requestBody.token);
}