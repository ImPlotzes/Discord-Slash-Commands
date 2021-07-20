// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "source",
    description: "Get a link to the GitHub repo with the source code of this bot."
};


export function handleSource(request, requestBody) {
    // This is just a static embed so we can return it right away

    return {
        embeds: [
            {
                title: "Source Code",
                description: "This application is open source. You can check out the GitHub repo with the source code by clicking [HERE](https://github.com/ImPlotzes/Discord-Slash-Commands).",
                color: parseInt("76cc00", 16),
                image: {
                    url: "https://repository-images.githubusercontent.com/387602281/77d1db5e-ad27-4e3e-a463-164cde00c182"
                }
            }
        ]
    };
}