// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "daily",
    description: "Look at the TNT Wizards statistics you got today so far.",
    options: [
        {
            name: "username",
            description: "The username of the player who's stats you want.",
            type: 3,
            required: true
        }
    ]
};


// Import the utils
import { editMessage, beautifyNumber } from "../utils";


export async function handleDaily(request, requestBody) {
    // Get the user (this can be their name OR their UUID)
    const user = requestBody.data.options[0].value;

    // Get the stats from the API made by marmottchen
    let response, body;
    try {
        response = await fetch("https://marmottchen.eu.pythonanywhere.com/" + encodeURIComponent(user) + "/today/json");
        body = await response.json();
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Something went wrong contacting the API.\n```\n" + e + "\n```",
                    color: parseInt("F12525", 16),
                    footer: {
                        text: "Statistics provided by marmottchen."
                    }
                }
            ]
        }, requestBody.token);
        return;
    }

    // Check if the API call returned an error
    if(response.status != 200) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "The API returned an error.\n```\n" + (body.error ?? response.status) + "\n```",
                    color: parseInt("F12525", 16),
                    footer: {
                        text: "Statistics provided by marmottchen."
                    }
                }
            ]
        }, requestBody.token);
        return;
    }

    // Calculate some values
    const kdRatio = Math.round(body.player.kills / (body.player.deaths == 0 ? 1 : body.player.deaths) * 100) / 100;
    const kwRatio = Math.round(body.player.kills / (body.player.wins == 0 ? 1 : body.player.wins) * 100) / 100;

    let airTime = "0 seconds";
    if(body.player.air_time > 0) {
      airTime = Math.round(body.player.air_time / 20);
      const h = Math.floor(airTime / 3600);
      const m = Math.floor(airTime % 3600 / 60);
      const s = Math.floor(airTime % 3600 % 60);
      const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      airTime = hDisplay + mDisplay + sDisplay;
    }


    await editMessage({
        embeds: [
            {
                author: {
                    name: "TNT Wizards"
                },
                title: body.player.name.replace(/_/g, "\\_"),
                description: "Showing the statistics from <t:" + Math.round(new Date(body.date).getTime() / 1000) + ":D>.",
                url: "https://marmottchen.eu.pythonanywhere.com/" + encodeURIComponent(body.player.name),
                color: parseInt("76cc00", 16),
                fields: [
                    {
                      "name": "Wins",
                      "value": "`" + beautifyNumber(body.player.wins) + "`",
                      "inline": true
                    },
                    {
                      "name": "Kills",
                      "value": "`" + beautifyNumber(body.player.kills) + "`",
                      "inline": true
                    },
                    {
                      "name": "Deaths",
                      "value": "`" + beautifyNumber(body.player.deaths) + "`",
                      "inline": true
                    },
                    {
                      "name": "Assists",
                      "value": "`" + beautifyNumber(body.player.assists) + "`",
                      "inline": true
                    },
                    {
                      "name": "K/D Ratio",
                      "value": "`" + beautifyNumber(kdRatio) + "`",
                      "inline": true
                    },
                    {
                      "name": "K/W Ratio",
                      "value": "`" + beautifyNumber(kwRatio) + "`",
                      "inline": true
                    },
                    {
                      "name": "Points Captured",
                      "value": "`" + beautifyNumber(body.player.points) + "`",
                      "inline": true
                    },
                    {
                      "name": "Air time",
                      "value": "`" + airTime + "`"
                    },
                    {
                      "name": "Class Specific Statistics",
                      "value": "Below you will find statistics per class."
                    },
                    {
                      "name": "Ancient",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.ancient.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.ancient.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Blood",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.blood.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.blood.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Fire",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.fire.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.fire.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Hydro",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.hydro.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.hydro.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Ice",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.ice.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.ice.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Kinetic",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.kinetic.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.kinetic.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Storm",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.storm.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.storm.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Toxic",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.toxic.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.toxic.deaths) + "`\n-----------------",
                      "inline": true
                    },
                    {
                      "name": "Wither",
                      "value": "Kills: `" + beautifyNumber(body.player.kits.wither.kills) + "`\nDeaths: `" + beautifyNumber(body.player.kits.wither.deaths) + "`\n-----------------",
                      "inline": true
                    }
                ],
                thumbnail: {
                    url: "https://skins.plotzes.com/face?player=" + body.player.uuid
                },
                footer: {
                    text: "Statistics provided by marmottchen."
                }
            }
        ]
    }, requestBody.token);
}