// Command stucture for when I want to change it.
// Changing it is done manually so this 'structure' isn't 
// actually being used anywhere in the code.
const structure = {
    name: "leaderboard",
    description: "Look at the leaderboard of a TNT Wizards statistic.",
    options: [
        {
            name: "statistic",
            description: "The statistic you would like to see the leaderboard of.",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Wizard wins",
                    value: "w"
                },
                {
                    name: "Total kills",
                    value: "k"
                },
                {
                    name: "Total assists",
                    value: "a"
                },
                {
                    name: "Total deaths",
                    value: "d"
                },
                {
                    name: "Veteran kills",
                    value: "vet_k"
                },
                {
                    name: "Captured points",
                    value: "p"
                },
                {
                    name: "Air time",
                    value: "t"
                },
                {
                    name: "Kill death ratio",
                    value: "kd"
                },
                {
                    name: "Ancient kills",
                    value: "a_k"
                },
                {
                    name: "Blood kills",
                    value: "b_k"
                },
                {
                    name: "Fire kills",
                    value: "f_k"
                },
                {
                    name: "Hydro kills",
                    value: "h_k"
                },
                {
                    name: "Ice kills",
                    value: "i_k"
                },
                {
                    name: "Kinetic kills",
                    value: "k_k"
                },
                {
                    name: "Storm kills",
                    value: "s_k"
                },
                {
                    name: "Toxic kills",
                    value: "t_k"
                },
                {
                    name: "Wither kills",
                    value: "w_k"
                },
                {
                    name: "Plotzes rating",
                    value: "p_r"
                }
            ]
        },
        {
            name: "username",
            description: "The username (or UUID) of the player you want to focus on.",
            type: 3,
            required: false
        }
    ]
};



import { editMessage, beautifyNumber } from "../utils";


// A table to convert the stats to their readable name
const statNamesTable = {
    w: "Wins",
    k: "Total kills",
    a: "Total assists",
    d: "Total deaths",
    vet_k: "Veteran kills",
    p: "Captured points",
    t: "Air time",
    kd: "Kill death ratio",
    a_k: "Ancient kills",
    b_k: "Blood kills",
    f_k: "Fire kills",
    h_k: "Hydro kills",
    i_k: "Ice kills",
    k_k: "Kinetic kills",
    s_k: "Storm kills",
    t_k: "Toxic kills",
    w_k: "Wither kills",
    p_r: "Plotzes rating"
}


/**
 * Handles the leaderboard command
 * @param {Request} request The HTTP request from Discord
 * @param {Object} requestBody The request body as a JSON object
 */
export async function handleLeaderboard(request, requestBody) {
    // Get the selected stat
    const stat = requestBody.data.options[0].value;

    // Fetch the leaderboard JSON file
    let lbResponse 
    try {
        lbResponse = await fetch("https://api.plotzes.ml/storage?name=leaderboard.json", {
            headers: {
                "user-agent": (SCRIPT_IDENTIFIER || "bot-clone") + " (The '/leaderboard' command)"
            }
        });
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Wasn't able to fetch the leaderboard.\n```\n" + e + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // If the HTTP response code isn't 200 then return an error
    if(lbResponse.status != 200) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Fetching leaderboard returned an error code. Code: `" + lbResponse.status + "`",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Try to parse the leaderboard response body into a JSON object
    let leaderboard;
    try {
        leaderboard = await lbResponse.json();
        if(!(leaderboard instanceof Array)) {
            throw new Error("Leaderboard not array.");
        }
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "The leaderboard got returned in an unexpected format.\n```\n" + e + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Sort the leaderboard according to the selected stat type and get some info while doing it
    leaderboard.sort((a, b) => {
        return b[stat] - a[stat];
    });

    // Create the half the table that shows the leaderboard
    let table = `Rank   | Name               | ${statNamesTable[stat]}
-------+--------------------+--------------------`;
    
    // If there wasn't a selected player then show the top 10
    let player = requestBody.data.options[1];
    if(!player) {
        for(let i = 0; i < leaderboard.length && i < 10; i++) {
            table += `
#${((i + 1) + "      ").slice(0, 6)}| ${(leaderboard[i].name + "                   ").slice(0, 19)}| ${getStatPretty(leaderboard[i], stat)}`;
        }

        if(leaderboard.length > 10) {
            table += "\n...    | ...                | ...";
        }

        // Show the message
        await editMessage({
            embeds: [
                {
                    title: "TNT Wizards",
                    description: "```\n" + table + "\n```",
                    footer: {
                        text: beautifyNumber(leaderboard.length) + " total players"
                    },
                    color: parseInt("76cc00", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // There was a player selected, so now get the actual name or UUID
    player = player.value.replace(/-/g, "").toLowerCase();

    // Go through the leaderboard and give everyone their rank
    let selectedPlayerRank = -1;
    for(let i = 0; i < leaderboard.length; i++) {
        if(player == leaderboard[i].name.toLowerCase() || player == leaderboard[i].id) {
            selectedPlayerRank = i;
            break;
        }
    }

    // If the player isn't on the leaderboard then return top 10 and say that they weren't on the leaderboard
    if(selectedPlayerRank < 0) {
        for(let i = 0; i < leaderboard.length && i < 10; i++) {
            table += `
#${((i + 1) + "      ").slice(0, 6)}| ${(leaderboard[i].name + "                   ").slice(0, 19)}| ${getStatPretty(leaderboard[i], stat)}`;
        }

        if(leaderboard.length > 10) {
            table += "\n...    | ...                | ...";
        }


        // Show the message
        await editMessage({
            embeds: [
                {
                    title: "TNT Wizards",
                    description: "The player `" + player + "` isn't on the leaderboard. To add that player click [here](https://www.plotzes.ml/stats/" + encodeURIComponent(player) +").\n\nShowing the top ten players:\n```\n" + table + "\n```",
                    footer: {
                        text: beautifyNumber(leaderboard.length) + " total players"
                    },
                    color: parseInt("76cc00", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // If the player is in the top 10 then show all top 10 players
    if(selectedPlayerRank <= 10) {
        for(let i = 0; i < leaderboard.length && i < 10; i++) {
            table += `
#${((i + 1) + "      ").slice(0, 6)}| ${(leaderboard[i].name + "                   ").slice(0, 19)}| ${getStatPretty(leaderboard[i], stat)}`;
            
            // Add the arrow if this is the selected player
            if(i == selectedPlayerRank) {
                table += "  <===";
            }
        }

        if(leaderboard.length > 10) {
            table += "\n...    | ...                | ...";
        }

        // Show the message
        await editMessage({
            embeds: [
                {
                    title: "TNT Wizards",
                    description: "```\n" + table + "\n```",
                    footer: {
                        text: beautifyNumber(leaderboard.length) + " total players"
                    },
                    color: parseInt("76cc00", 16)
                }
            ]
        }, requestBody.token);

    // So selected player is not in top 10
    } else {
        // Show the top 5
        for(let i = 0; i < 5; i++) {
            table += `
#${((i + 1) + "      ").slice(0, 6)}| ${(leaderboard[i].name + "                   ").slice(0, 19)}| ${getStatPretty(leaderboard[i], stat)}`;
        }

        table += "\n...    | ...                | ...";

        // Show the selected players and 2 above and below them
        for(let i = selectedPlayerRank - 2; i < selectedPlayerRank + 3 && i < leaderboard.length; i++) {
            table += `
#${((i + 1) + "      ").slice(0, 6)}| ${(leaderboard[i].name + "                   ").slice(0, 19)}| ${getStatPretty(leaderboard[i], stat)}`;

            // Add the arrow if this is the selected player
            if(i == selectedPlayerRank) {
                table += "  <===";
            }
        }

        // Show the message
        await editMessage({
            embeds: [
                {
                    title: "TNT Wizards",
                    description: "```\n" + table + "\n```",
                    footer: {
                        text: beautifyNumber(leaderboard.length) + " total players"
                    },
                    color: parseInt("76cc00", 16)
                }
            ]
        }, requestBody.token);
    }
}


/**
 * Gets the stat and formats it correctly of a player
 * @param {Object} player An object with all the player's stat
 * @param {String} stat The stat that you want
 * @returns {String} The stat in human readable form
 */
function getStatPretty(player, stat) {
    // If air time was chosen then we need extra formatting
    if(stat == "t") {
        const time = Math.round(player[stat] / 20);
        const h = Math.floor(time / 3600);
        const m = Math.floor(time % 3600 / 60);
        const s = Math.floor(time % 3600 % 60);

        const hDisplay = h > 0 ? h + "h " : "";
        const mDisplay = m > 0 ? m + "m " : "";
        const sDisplay = s > 0 ? s + "s" : "";
        return hDisplay + mDisplay + sDisplay;
    }

    // No air time chosen, just return it as a number with thousands seperators
    return beautifyNumber(player[stat]);
}