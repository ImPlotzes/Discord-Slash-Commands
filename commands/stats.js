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


// Import the utils
import { editMessage, beautifyNumber } from "../utils";


const STAT_MENU = [
    {
        type: 1,
        components: [
            {
                type: 3,
                custom_id: "stats_menu",
                options: [
                    {
                        label: "TNT Games",
                        value: "tnt",
                        emoji: {
                            id: null,
                            name: "💥"
                        }
                    },
                    {
                        label: "Bow Spleef",
                        value: "bow",
                        emoji: {
                            id: null,
                            name: "🏹"
                        }
                    },
                    {
                        label: "TNT Run",
                        value: "run",
                        emoji: {
                            id: null,
                            name: "🏃"
                        }
                    },
                    {
                        label: "PVP Run",
                        value: "pvp",
                        emoji: {
                            id: null,
                            name: "⚔️"
                        }
                    },
                    {
                        label: "TNT Tag",
                        value: "tag",
                        emoji: {
                            id: null,
                            name: "🙋"
                        }
                    },
                    {
                        label: "Wizards",
                        value: "wiz",
                        emoji: {
                            id: null,
                            name: "🧙"
                        }
                    }
                ]
            }
        ]
    }
];


export async function handleStatsCommand(request, requestBody) {
    // Get the user (this can be their name OR their UUID)
    const user = requestBody.data.options[0].value;

    // Get the stats from the API
    let response;
    try {
        response = await fetch("https://api.plotzes.com/stats?player=" + encodeURIComponent(user), {
            headers: {
                "user-agent": (SCRIPT_IDENTIFIER || "bot-clone") + " (The '/stats' command)"
            }
        });
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Something went wrong contacting the API.\n```\n" + e + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Get the response object from the API
    let body;
    try {
        body = await response.json();
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "The API returned an unexpected response.\n```\n" + e + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Check if the API call returned an error
    if(!body.success) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: body.message + "\n```\n" + body.code + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // Get the stat menu and make the TNT Games default
    let menu = JSON.parse(JSON.stringify(STAT_MENU)); // Makes a copy
    menu[0].components[0].options[0].default = true;

    // Get the data
    const data = body.data;

    // We have all info so we can edit the loading response
    const message = await editMessage({
        embeds: [
            {
                author: {
                    name: "TNT Games"
                },
                title: data.profile.name.replace(/_/g, "\\_"),
                url: "https://plotzes.com/stats/" + encodeURIComponent(data.mc.stats.UUID),
                color: parseInt("76cc00", 16),
                fields: [
                    {
                        name: "Last Login",
                        value: (data.profile.stats.last_login == "Unknown" ? "`Unknown`" : "<t:" + (new Date(data.profile.stats.last_login).getTime() / 1000) + ":R>"),
                        inline: true
                    },
                    {
                        name: "Last Played Game",
                        value: "`" + data.profile.stats.last_game_played + "`",
                        inline: true
                    },
                    {
                        name: "Wins",
                        value: "`" + beautifyNumber(data.tnt.stats.wins) + "`",
                        inline: true
                    },
                    {
                        name: "Win Streak",
                        value: "`" + beautifyNumber(data.tnt.stats.win_streak) + "`",
                        inline: true
                    },
                    {
                        name: "Coins",
                        value: "`" + beautifyNumber(data.tnt.stats.coins) + "`",
                        inline: true
                    },
                    {
                        name: "Playtime",
                        value: "`" + data.tnt.stats.playtime + "`",
                        inline: true
                    },
                    {
                        name: "Cosmetics",
                        value: "```yml\n" +
                        "Particle effect: " + (data.tnt.stats.particle_effect == "None" ? "-" : data.tnt.stats.particle_effect) + "\n" +
                        "Death effect: " + (data.tnt.stats.death_effect == "None" ? "-" : data.tnt.stats.death_effect) + "\n" +
                        "Double jump effect: " + (data.tnt.stats.double_jump_effect == "None" ? "-" : data.tnt.stats.double_jump_effect) + "\n" +
                        "Void message: " + (data.tnt.stats.void_message == "None" ? "-" : data.tnt.stats.void_message) + "\n" +
                        "Selected hat: " + (data.tnt.stats.selected_hat == "None" ? "-" : data.tnt.stats.selected_hat) + "\n```"
                    },
                    {
                        name: "Settings",
                        value: "```yml\n" +
                        "Action bar in Wizards: " + data.tnt.settings.action_bar_in_Wizards + "\n" +
                        "Action bar in TNT/PVP Run: " + data.tnt.settings["action_bar_in_TNT/PVP_Run"] + "\n" +
                        "Action bar in TNT Tag: " + data.tnt.settings.action_bar_in_TNT_Tag + "\n" +
                        "Tip holograms: " + data.tnt.settings.tip_holograms + "\n" +
                        "Cooldown messages in Wizards: " + data.tnt.settings.cooldown_messages_in_Wizards + "\n" +
                        "Double jump feather: " + data.tnt.settings.double_jump_feather + "\n" +
                        "Show prestige particles in Wizards: " + data.tnt.settings.show_prestige_particles_in_Wizards + "\n```"
                    }
                ],
                thumbnail: {
                    url: "https://skins.plotzes.com/face?player=" + data.mc.stats.UUID + "&rand=" + Math.random()
                },
                footer: {
                    text: "Choose a game below."
                }
            }
        ],
        components: menu
    }, requestBody.token);

    // Parse the message data that is returned when we edited the original response
    const messageJson = await message.json();

    // Cache the API response we had so we can access the data when the
    // user selects a specific game in the dropdown menu quickly.
    // The cache expects a URL for the first parameter so we make one up.
    const cache = caches.default;
    const cacheResponse = new Response(JSON.stringify(data));
    cacheResponse.headers.set("Cache-Control", "max-age=604800")
    await cache.put("https://thisismycache.com/" + messageJson.id, cacheResponse);
}



export async function handleStatsMenu(request, requestBody) {
    // Try to get the data from the cache that we got when the command got run
    const cache = caches.default;
    const response = await cache.match("https://thisismycache.com/" + requestBody.message.id);

    // Select their selection in the menu
    let menu = JSON.parse(JSON.stringify(STAT_MENU)); // Makes a copy
    const values = ["tnt", "bow", "run", "pvp", "tag", "wiz"];
    menu[0].components[0].options[values.indexOf(requestBody.data.values[0])].default = true;

    // If there is nothing in the cache ̶(t̶h̶e̶n̶ ̶w̶e̶'̶r̶e̶ ̶f̶u̶c̶k̶e̶d) then we return an error
    if(!response) {
        // Disable the menu
        menu[0].components[0].disabled = true;

        return {
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't find the player data in the cache. This is either an old message or the original command was handled by another colo.\nPlease execute this command again.",
                    color: parseInt("F12525", 16),
                    footer: {
                        text: "This colo: " + request.cf.colo
                    }
                }
            ],
            components: menu
        };
    }

    // Ok so we know data is available

    // Time to get the data
    const data = await response.json();

    // Check what was selected
    switch (requestBody.data.values[0]) {
        // TNT Games (default when you run the command)
        case "tnt":
            return {
                embeds: [
                    {
                        author: {
                            name: "TNT Games"
                        },
                        title: data.profile.name.replace(/_/g, "\\_"),
                        url: "https://plotzes.com/stats/" + encodeURIComponent(data.mc.stats.UUID),
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Last Login",
                                value: (data.profile.stats.last_login == "Unknown" ? "`Unknown`" : "<t:" + (new Date(data.profile.stats.last_login).getTime() / 1000) + ":R>"),
                                inline: true
                            },
                            {
                                name: "Last Played Game",
                                value: "`" + data.profile.stats.last_game_played + "`",
                                inline: true
                            },
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(data.tnt.stats.wins) + "`",
                                inline: true
                            },
                            {
                                name: "Win Streak",
                                value: "`" + beautifyNumber(data.tnt.stats.win_streak) + "`",
                                inline: true
                            },
                            {
                                name: "Coins",
                                value: "`" + beautifyNumber(data.tnt.stats.coins) + "`",
                                inline: true
                            },
                            {
                                name: "Playtime",
                                value: "`" + data.tnt.stats.playtime + "`",
                                inline: true
                            },
                            {
                                name: "Cosmetics",
                                value: "```yml\n" +
                                "Particle effect: " + (data.tnt.stats.particle_effect == "None" ? "-" : data.tnt.stats.particle_effect) + "\n" +
                                "Death effect: " + (data.tnt.stats.death_effect == "None" ? "-" : data.tnt.stats.death_effect) + "\n" +
                                "Double jump effect: " + (data.tnt.stats.double_jump_effect == "None" ? "-" : data.tnt.stats.double_jump_effect) + "\n" +
                                "Void message: " + (data.tnt.stats.void_message == "None" ? "-" : data.tnt.stats.void_message) + "\n" +
                                "Selected hat: " + (data.tnt.stats.selected_hat == "None" ? "-" : data.tnt.stats.selected_hat) + "\n```"
                            },
                            {
                                name: "Settings",
                                value: "```yml\n" +
                                "Action bar in Wizards: " + data.tnt.settings.action_bar_in_Wizards + "\n" +
                                "Action bar in TNT/PVP Run: " + data.tnt.settings["action_bar_in_TNT/PVP_Run"] + "\n" +
                                "Action bar in TNT Tag: " + data.tnt.settings.action_bar_in_TNT_Tag + "\n" +
                                "Tip holograms: " + data.tnt.settings.tip_holograms + "\n" +
                                "Cooldown messages in Wizards: " + data.tnt.settings.cooldown_messages_in_Wizards + "\n" +
                                "Double jump feather: " + data.tnt.settings.double_jump_feather + "\n" +
                                "Show prestige particles in Wizards: " + data.tnt.settings.show_prestige_particles_in_Wizards + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://skins.plotzes.com/face?player=" + data.mc.stats.UUID + "&rand=" + Math.random()
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            };


        // Bow Spleef
        case "bow":
            return {
                embeds: [
                    {
                        author: {
                            name: "Bow Spleef"
                        },
                        title: data.profile.name.replace(/_/g, "\\_"),
                        url: "https://plotzes.com/stats/" + encodeURIComponent(data.mc.stats.UUID),
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(data.bow.wins) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(data.bow.deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Shots",
                                value: "`" + beautifyNumber(data.bow.shots) + "`",
                                inline: true
                            },
                            {
                                name: "Win Loss Ratio",
                                value: "`" + beautifyNumber(data.bow.win_loss_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "Shots Per Game Ratio",
                                value: "`" + beautifyNumber(data.bow.shots_per_game_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\n" +
                                "Double jumps: " + data.bow.double_jumps + "\n" +
                                "Triple shots: " + data.bow.triple_shots + "\n" +
                                "Arrow volleys: " + data.bow.arrow_volleys + "\n" +
                                "Repulsors: " + data.bow.repulsors + "\n" +
                                "Explosive dashes: " + data.bow.explosive_dashes + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://skins.plotzes.com/face?player=" + data.mc.stats.UUID + "&rand=" + Math.random()
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            };
    

        // TNT Run
        case "run":
            return {
                embeds: [
                    {
                        author: {
                            name: "TNT Run"
                        },
                        title: data.profile.name.replace(/_/g, "\\_"),
                        url: "https://plotzes.com/stats/" + encodeURIComponent(data.mc.stats.UUID),
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(data.run.wins) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(data.run.deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Longest Run",
                                value: "`" + data.run.longest_run + "`",
                                inline: true
                            },
                            {
                                name: "Win Loss Ratio",
                                value: "`" + beautifyNumber(data.run.win_loss_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "Blocks Broken",
                                value: "`" + beautifyNumber(data.run.blocks_broken) + "`",
                                inline: true
                            },
                            {
                                name: "Potions Thrown On Players",
                                value: "`" + beautifyNumber(data.run.potions_thrown_on_players) + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\n" +
                                "Double jumps: " + data.run.double_jumps + "\n" +
                                "Slowness Potions: " + data.run.slowness_potions + "\n" +
                                "Speed potions: " + data.run.speed_potions + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://skins.plotzes.com/face?player=" + data.mc.stats.UUID + "&rand=" + Math.random()
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            }


        // PVP Run
        case "pvp":
            return {
                embeds: [
                    {
                        author: {
                            name: "PVP Run"
                        },
                        title: data.profile.name.replace(/_/g, "\\_"),
                        url: "https://plotzes.com/stats/" + encodeURIComponent(data.mc.stats.UUID),
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(data.pvp.wins) + "`",
                                inline: true
                            },
                            {
                                name: "Kills",
                                value: "`" + beautifyNumber(data.pvp.kills) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(data.pvp.deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Win Loss Ratio",
                                value: "`" + beautifyNumber(data.pvp.win_loss_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "K/D Ratio",
                                value: "`" + beautifyNumber(data.pvp.kill_death_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "Kills Per Game Ratio",
                                value: "`" + beautifyNumber(data.pvp.kills_per_game_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "Longest Run",
                                value: "`" + data.pvp.longest_run + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\n" +
                                "Double jumps: " + data.pvp.double_jumps + "\n" +
                                "Regeneration: " + data.pvp.regeneration + "\n" +
                                "Notoriety: " + data.pvp.notoriety + "\n" +
                                "Fortitude: " + data.pvp.fortitude + "\n" +
                                "Slowness Potions: " + data.pvp.slowness_potions + "\n" +
                                "Speed potions: " + data.pvp.speed_potions + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://skins.plotzes.com/face?player=" + data.mc.stats.UUID + "&rand=" + Math.random()
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            };


        // TNT Tag
        case "tag": 
            return  {
                embeds: [
                    {
                        author: {
                            name: "TNT Tag"
                        },
                        title: data.profile.name.replace(/_/g, "\\_"),
                        url: "https://plotzes.com/stats/" + encodeURIComponent(data.mc.stats.UUID),
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(data.tag.wins) + "`",
                                inline: true
                            },
                            {
                                name: "Kills",
                                value: "`" + beautifyNumber(data.tag.kills) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(data.tag.deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Tags",
                                value: "`" + beautifyNumber(data.tag.tags) + "`",
                                inline: true
                            },
                            {
                                name: "Average Tags Per Kill",
                                value: "`" + beautifyNumber(data.tag.average_tags_per_kill) + "`",
                                inline: true
                            },
                            {
                                name: "Kill Win Ratio",
                                value: "`" + beautifyNumber(data.tag.kill_win_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\n" +
                                "Blast Protection: " + data.tag.blast_protection + "\n" +
                                "Speedy: " + data.tag.speedy + "\n" +
                                "Speed It Up: " + data.tag.speed_it_up + "\n" +
                                "Slow It Down: " + data.tag.slow_it_down + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://skins.plotzes.com/face?player=" + data.mc.stats.UUID + "&rand=" + Math.random()
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            }


        // Wizards (Best game ever :D)
        case "wiz":
            return {
                embeds: [
                    {
                        author: {
                            name: "Wizards"
                        },
                        title: data.profile.name.replace(/_/g, "\\_"),
                        url: "https://plotzes.com/stats/" + encodeURIComponent(data.mc.stats.UUID),
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(data.wiz.stats.wins) + "`",
                                inline: true
                            },
                            {
                                name: "Kills",
                                value: "`" + beautifyNumber(data.wiz.stats.kills) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(data.wiz.stats.deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Assists",
                                value: "`" + beautifyNumber(data.wiz.stats.assists) + "`",
                                inline: true
                            },
                            {
                                name: "K/D Ratio",
                                value: "`" + beautifyNumber(data.wiz.stats.kill_death_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "K/W Ratio",
                                value: "`" + beautifyNumber(data.wiz.stats.kill_win_ratio) + "`",
                                inline: true
                            },
                            {
                                name: "Points Captured",
                                value: "`" + beautifyNumber(data.wiz.stats.points_captured) + "`",
                                inline: true
                            },
                            {
                                name: "Selected Class",
                                value: "`" + data.wiz.selected_class.charAt(0).toUpperCase() + data.wiz.selected_class.slice(1) + "`",
                                inline: true
                            },
                            {
                                name: "Air time",
                                value: "`" + data.wiz.stats.air_time + "`"
                            },
                            {
                                name: "Class Specific Statistics",
                                value: "Below you will find statistics per class."
                            },
                            {
                                name: "Ancient",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[0][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[0][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[0][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[0][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Blood",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[1][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[1][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[1][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[1][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Fire",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[2][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[2][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[2][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[2][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Hydro",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[3][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[3][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[3][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[3][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Ice",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[4][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[4][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[4][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[4][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Kinetic",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[5][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[5][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[5][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[5][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Storm",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[6][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[6][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[6][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[6][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Toxic",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[7][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[7][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[7][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[7][1]) + "`\n-----------------",
                                inline: true
                            },
                            {
                                name: "Wither",
                                value: "Kills: `" + beautifyNumber(data.wiz.classes[8][0]) + "`\nDamage taken: `" + beautifyNumber(data.wiz.classes[8][5]) + "`\nAssists: `" + beautifyNumber(data.wiz.classes[8][2]) + "`\nDeaths: `" + beautifyNumber(data.wiz.classes[8][1]) + "`\n-----------------",
                                inline: true
                            }
                        ],
                        thumbnail: {
                            url: "https://skins.plotzes.com/face?player=" + data.mc.stats.UUID + "&rand=" + Math.random()
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            }


        // None of the above
        default:
            return {
                embeds: [
                    {
                        title: "Not successful",
                        description: "This selection hasn't been implemented yet. I'm working on it!",
                        color: parseInt("F12525", 16),
                        footer: {
                            text: "Choose another game below."
                        }
                    }
                ],
                components: menu
            };
    }
}
