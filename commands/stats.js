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
import { editMessage } from "../utils";


// To convert games to their readable string
const gameTypes = {
    QUAKECRAFT: "Quake",
    WALLS: "Walls",
    PAINTBALL: "Paintball",
    SURVIVAL_GAMES: "Blitz Survival Games",
    TNTGAMES: "TNT Games",
    VAMPIREZ: "VampireZ",
    WALLS3: "Mega Walls",
    ARCADE: "Arcade",
    ARENA: "Arena",
    UHC: "UHC Champions",
    MCGO: "Cops and Crims",
    BATTLEGROUND: "Warlords",
    SUPER_SMASH: "Smash Heroes",
    GINGERBREAD: "Turbo Kart Racers",
    HOUSING: "Housing",
    SKYWARS: "SkyWars",
    TRUE_COMBAT: "Crazy Walls",
    SPEED_UHC: "Speed UHC",
    SKYCLASH: "SkyClash",
    LEGACY: "Classic Games",
    PROTOTYPE: "Prototype",
    BEDWARS: "Bed Wars",
    MURDER_MYSTERY: "Murder Mystery",
    BUILD_BATTLE: "Build Battle",
    DUELS: "Duels",
    SKYBLOCK: "SkyBlock",
    PIT: "Pit"
};


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

    let uuid;

    // If the user is a name (16 characters or less) then first get their UUID
    if(user.length <= 16) {
        // Try to get the account data
        const accountRes = await fetch("https://api.ashcon.app/mojang/v1/user/" + user);

        // If the fetch wasn't successful then send their response back as to why it wasn't successful
        if(!accountRes.ok) {
            await editMessage({
                embeds: [
                    {
                        title: "Not successful",
                        description: "Couldn't get the UUID of `" + user + "`.\n```\n" + accountRes.statusText + "\n```",
                        color: parseInt("F12525", 16)
                    }
                ]
            }, requestBody.token);
            return;
        }

        try {
            // Try to parse the response body into a JSON object
            const accountData = await accountRes.json();

            // Get their UUID
            uuid = accountData.uuid;
        } catch(e) {
            // For some reason the API didn't return JSON... so return an error message
            await editMessage({
                embeds: [
                    {
                        title: "Not successful",
                        description: "Couldn't get the UUID of `" + user + "`. Got an unexpected response.",
                        color: parseInt("F12525", 16)
                    }
                ]
            }, requestBody.token);
            return;
        }
    } else {
        // The provided user is longer than 16 characters so it should already be an UUID
        uuid = user;
    }

    uuid = uuid.replace(/-/g, "");

    // Get the data from Hypixel
    const res = await fetch("https://api.hypixel.net/player?uuid=" + uuid + "&key=" + HYPIXEL_API_KEY);

    // Try to parse the response from Hypixel into JSON (can fail if Hypixel is down).
    // If the parsing indeed fails, then send an error message.
    let data;
    try {
        data = await res.json();
    } catch(e) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't get the data of `" + user + "` (UUID: `" + uuid + "`) from Hypixel. It might be offline.",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }
    

    // If the call wasn't successful then reply with a message as to why
    if(!res.ok || !data.success || !data.player) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't get the data of `" + user + "` (UUID: `" + uuid + "`) from Hypixel.\n```\n" + (data.cause || "No data") + "\n```",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    const username = data.player.displayname;

    // The player might have data, but not TNT Games stats. So check for TNT Games stats and if they're
    // not there then return an error message.
    if(!data.player.stats || !data.player.stats.TNTGames) {
        await editMessage({
            embeds: [
                {
                    title: "Not successful",
                    description: "`" + username + "` doesn't have any TNT Games stats.",
                    color: parseInt("F12525", 16)
                }
            ]
        }, requestBody.token);
        return;
    }

    // OK so the player has stats
    // Time to define all the stats we want to show 


    // Get the their rank
    let prefix = data.player.prefix;
    let rank = data.player.rank;
    let monthlyPackageRank = data.player.monthlyPackageRank;
    let packageRank = data.player.newPackageRank || data.player.packageRank;
    let rankPrefix = "";
    switch(packageRank) {
        case "VIP":
            rankPrefix = "[VIP] ";
            break;
        case "VIP_PLUS":
            rankPrefix = "[VIP+] ";
            break;
        case "MVP":
            rankPrefix = "[MVP] ";
            break;
        case "MVP_PLUS":
            rankPrefix = "[MVP+] ";
            break;
        default:
            break;
    }
    switch(monthlyPackageRank) {
        case "SUPERSTAR":
            rankPrefix = "[MVP++] ";
            break;
        default: 
            break;
    }
    switch(rank) {
        case "YOUTUBER":
            rankPrefix = "[YOUTUBE] ";
            break;
        case "HELPER":
            rankPrefix = "[HELPER] ";
            break;
        case "MODERATOR":
            rankPrefix = "[MOD] ";
            break;
        case "GAME_MASTER":
            rankPrefix = "[GM] ";
            break;
        case "ADMIN":
            rankPrefix = "[ADMIN] ";
            break;
        default:
            break;
    }
    if(prefix) {
        prefix = prefix.replace(/§./g, "");
        rankPrefix = prefix + " ";
    }
    
    // What their last played game was
    const lastPlayed = gameTypes[data.player.mostRecentGameType] || "Unknown";

    // When they logged in for the last time
    let lastLogin;
    if(data.player.lastLogin) {
        lastLogin = Math.round(data.player.lastLogin / 1000);
    }

    // We get the playtime from the TNT Triathlon achievement which counts playtime in seconds
    let playtime = "0 minutes";
    if(data.player.achievements && data.player.achievements.tntgames_tnt_triathlon) {
        const time = data.player.achievements.tntgames_tnt_triathlon;
        const h = Math.floor(time / 60);
        const m = Math.floor(time % 60);

        const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
        playtime = hDisplay + mDisplay;
    }

    const tntData = data.player.stats.TNTGames;

    let wins = tntData.wins || 0;
    wins += (tntData.wins_pvprun || 0); // For some weird reason PVP Run wins aren't counted into the total wins...

    const winstreak = tntData.winstreak || 0;
    const coins = tntData.coins || 0;
    const particleEffect = tntData.new_active_particle_effect || "-";

    // All these effects are made a bit more readable right here
    let deathEffect = "-";
    if(tntData.new_active_death_effect) {
        let effect = tntData.new_active_death_effect.replaceAll("_", " ");
        deathEffect = effect.charAt(0).toUpperCase() + effect.slice(1);
    }
    let doubleJumpEffect = "-";
    if(data.new_double_jump_effect) {
        let effect = data.new_double_jump_effect.replaceAll("dje_", "");
        effect = effect.replaceAll("_", " ");
        doubleJumpEffect = effect.charAt(0).toUpperCase() + effect.slice(1);
    }
    let voidMessage = "-";
    if(tntData.active_void_message) {
        let message =  tntData.active_void_message.replaceAll("_", " ");
        voidMessage = message.charAt(0).toUpperCase() + message.slice(1);
    }
    let selectedHat = "-";
    if(tntData.new_selected_hat) {
        let hat = tntData.new_selected_hat.replaceAll("_", " ");
        selectedHat = hat.charAt(0).toUpperCase() + hat.slice(1);
    }

    // Now time for the settings
    // Currently all values default to 'true' but I'm not sure if some settings are turned off by default.
    // Please message me (Discord: Plotzes#8332; https://www.plotzes.ml/discord) if this isn't true
    const flagsData = tntData.flags || {};
    const actionBarWiz = flagsData.show_wizards_actionbar_info != undefined ? flagsData.show_wizards_actionbar_info : true;
    const actionBarRun = flagsData.show_tntrun_actionbar_info != undefined ? flagsData.show_tntrun_actionbar_info : true;
    const actionBarTag = flagsData.show_tnttag_actionbar_info != undefined ? flagsData.show_tnttag_actionbar_info : true;
    const tipHolograms = flagsData.show_tip_holograms != undefined ? flagsData.show_tip_holograms : true;
    const cooldownMessageWiz = flagsData.show_wizards_cooldown_notifications != undefined ? flagsData.show_wizards_cooldown_notifications : true;
    const doubleJumpFeather = flagsData.give_dj_feather != undefined ? flagsData.give_dj_feather : true;
    const prestigeParticlesWiz = flagsData.show_wiz_pres != undefined ? flagsData.show_wiz_pres : true;

    // Get the stat menu and make the TNT Games default
    let menu = JSON.parse(JSON.stringify(STAT_MENU));
    menu[0].components[0].options[0].default = true;


    // Ok now we have all info and we can edit the loading response
    const message = await editMessage({
        embeds: [
            {
                author: {
                    name: "TNT Games"
                },
                title: rankPrefix + username,
                url: "https://www.plotzes.ml/stats/" + uuid,
                color: parseInt("76cc00", 16),
                fields: [
                    {
                        name: "Last Login",
                        value: (lastLogin ? "<t:" + lastLogin + ":R>" : "`Unknown`"),
                        inline: true
                    },
                    {
                        name: "Last Played Game",
                        value: "`" + lastPlayed + "`",
                        inline: true
                    },
                    {
                        name: "Wins",
                        value: "`" + beautifyNumber(wins) + "`",
                        inline: true
                    },
                    {
                        name: "Win Streak",
                        value: "`" + beautifyNumber(winstreak) + "`",
                        inline: true
                    },
                    {
                        name: "Coins",
                        value: "`" + beautifyNumber(coins) + "`",
                        inline: true
                    },
                    {
                        name: "Playtime",
                        value: "`" + playtime + "`",
                        inline: true
                    },
                    {
                        name: "Cosmetics",
                        value: "```yml\nParticle effect: " + particleEffect + "\nDeath effect: " + deathEffect + "\nDouble jump effect: " + doubleJumpEffect + "\nVoid message: " + voidMessage + "\nSelected hat: " + selectedHat + "\n```"
                    },
                    {
                        name: "Settings",
                        value: "```yml\nAction bar in Wizards: " + actionBarWiz + "\nAction bar in TNT/PVP Run: " + actionBarRun + "\nAction bar in TNT Tag: " + actionBarTag + "\nTip holograms: " + tipHolograms + "\nCooldown messages in Wizards: " + cooldownMessageWiz + "\nDouble jump feather: " + doubleJumpFeather + "\nShow prestige particles in Wizards: " + prestigeParticlesWiz + "\n```"
                    }
                ],
                thumbnail: {
                    url: "https://www.mc-heads.net/body/" + uuid + "/left"
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

    // Cache the Hypixel response we had so we can access the data when the
    // user selects a specific game in the dropdown menu quickly.
    // The cache expects a URL for the first parameter so we make one up.
    const cache = caches.default;
    await cache.put("https://thisismycache.com/" + messageJson.id, new Response(JSON.stringify(data)));

    // Ok done!
}



// Add the thousands separators to make a number more readable
function beautifyNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



export async function handleStatsMenu(request, requestBody) {
    // Try to get the data from the cache that we got when the command got run
    const cache = caches.default;
    const response = await cache.match("https://thisismycache.com/" + requestBody.message.id);

    // Select their selection in the menu
    let menu = JSON.parse(JSON.stringify(STAT_MENU));
    const values = ["tnt", "bow", "run", "pvp", "tag", "wiz"];
    menu[0].components[0].options[values.indexOf(requestBody.data.values[0])].default = true;

    // If there is nothing in the cache ̶(t̶h̶e̶n̶ ̶w̶e̶'̶r̶e̶ ̶f̶u̶c̶k̶e̶d) then we return an error
    // -----------------^^ THIS IS SUBJECT TO CHANGE ^^------------------
    if(!response) {
        // Disable the menu
        menu[0].components[0].disabled = true;

        return {
            embeds: [
                {
                    title: "Not successful",
                    description: "Couldn't find the player data in the cache. This is either an old message or the original command was handled by another colo.",
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

    
    const username = data.player.displayname;
    const uuid = data.player.uuid;


    // Get the their rank because no matter what the selected game was, we're going to need this
    let prefix = data.player.prefix;
    let rank = data.player.rank;
    let monthlyPackageRank = data.player.monthlyPackageRank;
    let packageRank = data.player.newPackageRank || data.player.packageRank;
    let rankPrefix = "";
    switch(packageRank) {
        case "VIP":
            rankPrefix = "[VIP] ";
            break;
        case "VIP_PLUS":
            rankPrefix = "[VIP+] ";
            break;
        case "MVP":
            rankPrefix = "[MVP] ";
            break;
        case "MVP_PLUS":
            rankPrefix = "[MVP+] ";
            break;
        default:
            break;
    }
    switch(monthlyPackageRank) {
        case "SUPERSTAR":
            rankPrefix = "[MVP++] ";
            break;
        default: 
            break;
    }
    switch(rank) {
        case "YOUTUBER":
            rankPrefix = "[YOUTUBE] ";
            break;
        case "HELPER":
            rankPrefix = "[HELPER] ";
            break;
        case "MODERATOR":
            rankPrefix = "[MOD] ";
            break;
        case "GAME_MASTER":
            rankPrefix = "[GM] ";
            break;
        case "ADMIN":
            rankPrefix = "[ADMIN] ";
            break;
        default:
            break;
    }
    if(prefix) {
        prefix = prefix.replace(/§./g, "");
        rankPrefix = prefix + " ";
    }

    // Declare variables that are used in multiple cases
    // (Normally it wouldn't matter but Webpack won't build
    // if I declare the same variable twice, even if they're in different sections)
    let tntData;
    let wins;
    let kills;
    let deaths;
    let winLossRatio;
    let doubleJumps;
    let longestRun;
    let killDeathRatio;
    let slownessPotions;
    let speedPotions;

    // Check what was selected
    switch (requestBody.data.values[0]) {
        // TNT Games (default when you run the command)
        case "tnt":
            // Time to define all the stats we want to show 
            
            // What their last played game was
            const lastPlayed = gameTypes[data.player.mostRecentGameType] || "Unknown";

            // When they logged in for the last time
            let lastLogin;
            if(data.player.lastLogin) {
                lastLogin = Math.round(data.player.lastLogin / 1000);
            }

            // We get the playtime from the TNT Triathlon achievement which counts playtime in seconds
            let playtime = "0 minutes";
            if(data.player.achievements && data.player.achievements.tntgames_tnt_triathlon) {
                const time = data.player.achievements.tntgames_tnt_triathlon;
                const h = Math.floor(time / 60);
                const m = Math.floor(time % 60);

                const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                const mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
                playtime = hDisplay + mDisplay;
            }

            tntData = data.player.stats.TNTGames;

            wins = tntData.wins || 0;
            wins += (tntData.wins_pvprun || 0); // For some weird reason PVP Run wins aren't counted into the total wins...

            const winstreak = tntData.winstreak || 0;
            const coins = tntData.coins || 0;
            const particleEffect = tntData.new_active_particle_effect || "-";

            // All these effects are made a bit more readable right here
            let deathEffect = "-";
            if(tntData.new_active_death_effect) {
                let effect = tntData.new_active_death_effect.replaceAll("_", " ");
                deathEffect = effect.charAt(0).toUpperCase() + effect.slice(1);
            }
            let doubleJumpEffect = "-";
            if(data.new_double_jump_effect) {
                let effect = data.new_double_jump_effect.replaceAll("dje_", "");
                effect = effect.replaceAll("_", " ");
                doubleJumpEffect = effect.charAt(0).toUpperCase() + effect.slice(1);
            }
            let voidMessage = "-";
            if(tntData.active_void_message) {
                let message =  tntData.active_void_message.replaceAll("_", " ");
                voidMessage = message.charAt(0).toUpperCase() + message.slice(1);
            }
            let selectedHat = "-";
            if(tntData.new_selected_hat) {
                let hat = tntData.new_selected_hat.replaceAll("_", " ");
                selectedHat = hat.charAt(0).toUpperCase() + hat.slice(1);
            }

            // Now time for the settings
            // Currently all values default to 'true' but I'm not sure if some settings are turned off by default.
            // Please message me (Discord: Plotzes#8332; https://www.plotzes.ml/discord) if this isn't true
            const flagsData = tntData.flags || {};
            const actionBarWiz = flagsData.show_wizards_actionbar_info != undefined ? flagsData.show_wizards_actionbar_info : true;
            const actionBarRun = flagsData.show_tntrun_actionbar_info != undefined ? flagsData.show_tntrun_actionbar_info : true;
            const actionBarTag = flagsData.show_tnttag_actionbar_info != undefined ? flagsData.show_tnttag_actionbar_info : true;
            const tipHolograms = flagsData.show_tip_holograms != undefined ? flagsData.show_tip_holograms : true;
            const cooldownMessageWiz = flagsData.show_wizards_cooldown_notifications != undefined ? flagsData.show_wizards_cooldown_notifications : true;
            const doubleJumpFeather = flagsData.give_dj_feather != undefined ? flagsData.give_dj_feather : true;
            const prestigeParticlesWiz = flagsData.show_wiz_pres != undefined ? flagsData.show_wiz_pres : true;

            return {
                embeds: [
                    {
                        author: {
                            name: "TNT Games"
                        },
                        title: rankPrefix + username,
                        url: "https://www.plotzes.ml/stats/" + uuid,
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Last Login",
                                value: (lastLogin ? "<t:" + lastLogin + ":R>" : "`Unknown`"),
                                inline: true
                            },
                            {
                                name: "Last Played Game",
                                value: "`" + lastPlayed + "`",
                                inline: true
                            },
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(wins) + "`",
                                inline: true
                            },
                            {
                                name: "Win Streak",
                                value: "`" + beautifyNumber(winstreak) + "`",
                                inline: true
                            },
                            {
                                name: "Coins",
                                value: "`" + beautifyNumber(coins) + "`",
                                inline: true
                            },
                            {
                                name: "Playtime",
                                value: "`" + playtime + "`",
                                inline: true
                            },
                            {
                                name: "Cosmetics",
                                value: "```yml\nParticle effect: " + particleEffect + "\nDeath effect: " + deathEffect + "\nDouble jump effect: " + doubleJumpEffect + "\nVoid message: " + voidMessage + "\nSelected hat: " + selectedHat + "\n```"
                            },
                            {
                                name: "Settings",
                                value: "```yml\nAction bar in Wizards: " + actionBarWiz + "\nAction bar in TNT/PVP Run: " + actionBarRun + "\nAction bar in TNT Tag: " + actionBarTag + "\nTip holograms: " + tipHolograms + "\nCooldown messages in Wizards: " + cooldownMessageWiz + "\nDouble jump feather: " + doubleJumpFeather + "\nShow prestige particles in Wizards: " + prestigeParticlesWiz + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://www.mc-heads.net/body/" + uuid + "/left"
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            };
            break;


        // Bow Spleef
        case "bow":
            // Time to define all the stats we want to show

            tntData = data.player.stats.TNTGames;

            wins = tntData.wins_bowspleef || 0;
            deaths = tntData.deaths_bowspleef || 0;
            const shots = tntData.tags_bowspleef || 0;

            winLossRatio = Math.round(wins / (deaths == 0 ? 1 : deaths) * 100) / 100;
            const shotsPerGame = Math.round(shots / ((wins + deaths) == 0 ? 1 : (wins + deaths)) * 100) / 100;

            doubleJumps = tntData.new_spleef_double_jumps ? 4 + tntData.new_spleef_double_jumps + " (Upgrade " + tntData.new_spleef_double_jumps + ")": "5 (Upgrade 1)";
            const tripleShots = tntData.new_spleef_tripleshot ? 4 + tntData.new_spleef_tripleshot + " (Upgrade " + tntData.new_spleef_tripleshot + ")": "5 (Upgrade 1)";
            const arrowVolleys = tntData.new_spleef_arrowrain ? tntData.new_spleef_arrowrain + " (Upgrade " + tntData.new_spleef_arrowrain + ")": "1 (Upgrade 1)";
            const repulsors = tntData.new_spleef_repulsor ? 4 + tntData.new_spleef_repulsor + " (Upgrade " + tntData.new_spleef_repulsor + ")": "5 (Upgrade 1)";
            const explosiveDashes = tntData.new_spleef_exlosive_dash ? 4 + tntData.new_spleef_exlosive_dash + " (Upgrade " + tntData.new_spleef_exlosive_dash + ")": "5 (Upgrade 1)";

            // Ok that was easy now time to return the embed
            return {
                embeds: [
                    {
                        author: {
                            name: "Bow Spleef"
                        },
                        title: rankPrefix + username,
                        url: "https://www.plotzes.ml/stats/" + uuid,
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(wins) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Shots",
                                value: "`" + beautifyNumber(shots) + "`",
                                inline: true
                            },
                            {
                                name: "Win Loss Ratio",
                                value: "`" + beautifyNumber(winLossRatio) + "`",
                                inline: true
                            },
                            {
                                name: "Shots Per Game Ratio",
                                value: "`" + beautifyNumber(shotsPerGame) + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\nDouble jumps: " + doubleJumps + "\nTriple shots: " + tripleShots + "\nArrow volleys: " + arrowVolleys + "\nRepulsors: " + repulsors + "\nExplosive dashes: " + explosiveDashes + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://www.mc-heads.net/body/" + uuid + "/left"
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            };
            break;
    

        // TNT Run
        case "run":
            // Time to define all the stats we want to show

            let blocksBroken = 0;
            if(data.player.achievements) {
                blocksBroken = data.player.achievements.tntgames_block_runner || 0;
            }

            tntData = data.player.stats.TNTGames;

            wins = tntData.wins_tntrun || 0;
            deaths = tntData.deaths_tntrun || 0;

            longestRun = "0 minutes";
            if(tntData.record_tntrun) {
                const playtime = tntData.record_tntrun;
                const m = Math.floor(playtime / 60);
                const s = Math.floor(playtime % 60);
        
                const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                longestRun = mDisplay + sDisplay;
            }

            winLossRatio = Math.round(wins / (deaths == 0 ? 1 : deaths) * 100) / 100;
            const potionsOnPlayers = tntData.run_potions_splashed_on_players || 0;
            doubleJumps = tntData.new_tntrun_double_jumps ? 4 + tntData.new_tntrun_double_jumps + " (Upgrade " + tntData.new_tntrun_double_jumps + ")": "5 (Upgrade 1)";
            slownessPotions = tntData.new_tntrun_slowness_potions ? tntData.new_tntrun_slowness_potions + " (Upgrade " + tntData.new_tntrun_slowness_potions + ")": "1 (Upgrade 1)";
            speedPotions = tntData.new_tntrun_speed_potions ? tntData.new_tntrun_speed_potions + " (Upgrade " + tntData.new_tntrun_speed_potions + ")": "1 (Upgrade 1)";
            

            // Now we return the embed
            return {
                embeds: [
                    {
                        author: {
                            name: "TNT Run"
                        },
                        title: rankPrefix + username,
                        url: "https://www.plotzes.ml/stats/" + uuid,
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(wins) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Longest Run",
                                value: "`" + longestRun + "`",
                                inline: true
                            },
                            {
                                name: "Win Loss Ratio",
                                value: "`" + beautifyNumber(winLossRatio) + "`",
                                inline: true
                            },
                            {
                                name: "Blocks Broken",
                                value: "`" + beautifyNumber(blocksBroken) + "`",
                                inline: true
                            },
                            {
                                name: "Potions Thrown On Players",
                                value: "`" + beautifyNumber(potionsOnPlayers) + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\nDouble jumps: " + doubleJumps + "\nSlowness Potions: " + slownessPotions + "\nSpeed potions: " + speedPotions + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://www.mc-heads.net/body/" + uuid + "/left"
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            }
            break;


        // PVP Run
        case "pvp":
            // Time to define all the stats we want to show

            tntData = data.player.stats.TNTGames;

            wins = tntData.wins_pvprun || 0;
            kills = tntData.kills_pvprun || 0;
            deaths = tntData.deaths_pvprun || 0;

            longestRun = "0 minutes";
            if(tntData.record_pvprun) {
                const playtime = tntData.record_pvprun;
                const m = Math.floor(playtime / 60);
                const s = Math.floor(playtime % 60);
        
                const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                longestRun = mDisplay + sDisplay;
            }

            winLossRatio = Math.round(wins / (deaths == 0 ? 1 : deaths) * 100) / 100;
            killDeathRatio = Math.round(kills / (deaths == 0 ? 1 : deaths) * 100) / 100;
            const killsPerGameRatio = Math.round(kills / ((wins + deaths) == 0 ? 1 : (wins + deaths)) * 100) / 100;

            doubleJumps = tntData.new_pvprun_double_jumps ? 4 + tntData.new_pvprun_double_jumps + " (Upgrade " + tntData.new_pvprun_double_jumps + ")": "5 (Upgrade 1)";
            const regeneration = tntData.new_pvprun_regeneration ? tntData.new_pvprun_regeneration + (tntData.new_pvprun_regeneration == 1 ? " second (Upgrade " : " seconds (Upgrade ") + tntData.new_pvprun_regeneration + ")": "1 second (Upgrade 1)";
            const notoriety = tntData.new_pvprun_notoriety ? (tntData.new_pvprun_notoriety * 3) + "% chance (Upgrade " + tntData.new_pvprun_notoriety + ")": "3% (Upgrade 1)";
            const fortitude = tntData.new_pvprun_fortitude ? (tntData.new_pvprun_fortitude * 3) + "% chance (Upgrade " + tntData.new_pvprun_fortitude + ")": "3% (Upgrade 1)";
            slownessPotions = tntData.new_tntrun_slowness_potions ? tntData.new_tntrun_slowness_potions + " (Upgrade " + tntData.new_tntrun_slowness_potions + ")": "1 (Upgrade 1)";
            speedPotions = tntData.new_tntrun_speed_potions ? tntData.new_tntrun_speed_potions + " (Upgrade " + tntData.new_tntrun_speed_potions + ")": "1 (Upgrade 1)";

            // We have everything, return the embed
            return {
                embeds: [
                    {
                        author: {
                            name: "PVP Run"
                        },
                        title: rankPrefix + username,
                        url: "https://www.plotzes.ml/stats/" + uuid,
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(wins) + "`",
                                inline: true
                            },
                            {
                                name: "Kills",
                                value: "`" + beautifyNumber(kills) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Win Loss Ratio",
                                value: "`" + beautifyNumber(winLossRatio) + "`",
                                inline: true
                            },
                            {
                                name: "K/D Ratio",
                                value: "`" + beautifyNumber(killDeathRatio) + "`",
                                inline: true
                            },
                            {
                                name: "Kills Per Game Ratio",
                                value: "`" + beautifyNumber(killsPerGameRatio) + "`",
                                inline: true
                            },
                            {
                                name: "Longest Run",
                                value: "`" + longestRun + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\nDouble jumps: " + doubleJumps + "\nRegeneration: " + regeneration + "\nNotoriety: " + notoriety + "\nFortitude: " + fortitude + "\nSlowness Potions: " + slownessPotions + "\nSpeed potions: " + speedPotions + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://www.mc-heads.net/body/" + uuid + "/left"
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            };
            break;


        // TNT Tag
        case "tag": 
            // Time to define all the stats we want to show

            let tags = 0;
            if(data.player.achievements) {
                tags = data.player.achievements.tntgames_clinic || 0;
            }

            tntData = data.player.stats.TNTGames;

            wins = tntData.wins_tntag || 0;
            kills = tntData.kills_tntag || 0;

            const tagsPerKill = Math.round(tags / (kills == 0 ? 1 : kills) * 100) / 100;
            const killWinRatio = Math.round(kills / (wins == 0 ? 1 : wins) * 100) / 100;
            const blastProtection = tntData.tag_blastprotection ? tntData.tag_blastprotection + "% chance (Upgrade " + tntData.tag_blastprotection + ")" : "0% chance (No upgrade)";
            let speedy = tntData.new_tntag_speedy || 0;
            speedy = speedy > 4 ? 4 : speedy;
            speedy = speedy ? (10 + speedy * 3) + " seconds (Upgrade " + speedy + ")" : "13 seconds (Upgrade 1)";
            const speedItUp = tntData.tag_speeditup ? tntData.tag_speeditup + "% chance (Upgrade " + tntData.tag_speeditup + ")" : "0% chance (No upgrade)";
            const slowItDown = tntData.tag_slowitdown ? tntData.tag_slowitdown + "% chance (Upgrade " + tntData.tag_slowitdown + ")" : "0% chance (No upgrade)";

            // Lets return the embed
            return  {
                embeds: [
                    {
                        author: {
                            name: "TNT Tag"
                        },
                        title: rankPrefix + username,
                        url: "https://www.plotzes.ml/stats/" + uuid,
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(wins) + "`",
                                inline: true
                            },
                            {
                                name: "Kills",
                                value: "`" + beautifyNumber(kills) + "`",
                                inline: true
                            },
                            {
                                name: "Tags",
                                value: "`" + beautifyNumber(tags) + "`",
                                inline: true
                            },
                            {
                                name: "Average Tags Per Kill",
                                value: "`" + beautifyNumber(tagsPerKill) + "`",
                                inline: true
                            },
                            {
                                name: "Kill Win Ratio",
                                value: "`" + beautifyNumber(killWinRatio) + "`",
                                inline: true
                            },
                            {
                                name: "Upgrades",
                                value: "```yml\nBlast Protection: " + blastProtection + "\nSpeedy: " + speedy + "\nSpeed It Up: " + speedItUp + "\nSlow It Down: " + slowItDown + "\n```"
                            }
                        ],
                        thumbnail: {
                            url: "https://www.mc-heads.net/body/" + uuid + "/left"
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            }
            break;


        // Wizards (Best game ever :D)
        case "wiz":
            // Time to define all the stats we want to show

            tntData = data.player.stats.TNTGames;

            wins = tntData.wins_capture || 0;
            kills = tntData.kills_capture || 0;
            deaths = tntData.deaths_capture || 0;
            const assists = tntData.assists_capture || 0;

            killDeathRatio = Math.round((kills / (deaths == 0 ? 1 : deaths)) * 100) / 100;
            const pointsCaptured = tntData.points_capture || 0;

            let airtime = "0 seconds";
            if(tntData.air_time_capture) {
                const time = Math.round(tntData.air_time_capture / 20);
                const h = Math.floor(time / 3600);
                const m = Math.floor(time % 3600 / 60);
                const s = Math.floor(time % 3600 % 60);

                const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                airtime = hDisplay + mDisplay + sDisplay;
            }

            let selectedClass = tntData.wizards_selected_class ? tntData.wizards_selected_class.replace("new_", "").replace("wizard", " Wizard") : "Random";
            selectedClass = selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1);

            const ancientKills = tntData.new_ancientwizard_kills ? tntData.new_ancientwizard_kills : 0;
            const ancientDeaths = tntData.new_ancientwizard_deaths ? tntData.new_ancientwizard_deaths : 0;

            const bloodKills = tntData.new_bloodwizard_kills ? tntData.new_bloodwizard_kills : 0;
            const bloodDeaths = tntData.new_bloodwizard_deaths ? tntData.new_bloodwizard_deaths : 0;

            const fireKills = tntData.new_firewizard_kills ? tntData.new_firewizard_kills : 0;
            const fireDeaths = tntData.new_firewizard_deaths ? tntData.new_firewizard_deaths : 0;

            const hydroKills = tntData.new_hydrowizard_kills ? tntData.new_hydrowizard_kills : 0;
            const hydroDeaths = tntData.new_hydrowizard_deaths ? tntData.new_hydrowizard_deaths : 0;

            const iceKills = tntData.new_icewizard_kills ? tntData.new_icewizard_kills : 0;
            const iceDeaths = tntData.new_icewizard_deaths ? tntData.new_icewizard_deaths : 0;

            const kineticKills = tntData.new_kineticwizard_kills ? tntData.new_kineticwizard_kills : 0;
            const kineticDeaths = tntData.new_kineticwizard_deaths ? tntData.new_kineticwizard_deaths : 0;

            const stormKills = tntData.new_stormwizard_kills ? tntData.new_stormwizard_kills : 0;
            const stormDeaths = tntData.new_stormwizard_deaths ? tntData.new_stormwizard_deaths : 0;

            const toxicKills = tntData.new_toxicwizard_kills ? tntData.new_toxicwizard_kills : 0;
            const toxicDeaths = tntData.new_toxicwizard_deaths ? tntData.new_toxicwizard_deaths : 0;

            const witherKills = tntData.new_witherwizard_kills ? tntData.new_witherwizard_kills : 0;
            const witherDeaths = tntData.new_witherwizard_deaths ? tntData.new_witherwizard_deaths : 0;

            // Create the class specific stats table
            let table = "```\n" +
            "Class      | Kills     | Deaths    \n" +
            "-----------+-----------+-----------\n" +
            "Ancient    | " + (beautifyNumber(ancientKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(ancientDeaths) + "          ").slice(0, 10) + "\n" +
            "Blood      | " + (beautifyNumber(bloodKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(bloodDeaths) + "          ").slice(0, 10) + "\n" +
            "Fire       | " + (beautifyNumber(fireKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(fireDeaths) + "          ").slice(0, 10) + "\n" +
            "Hydro      | " + (beautifyNumber(hydroKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(hydroDeaths) + "          ").slice(0, 10) + "\n" +
            "Ice        | " + (beautifyNumber(iceKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(iceDeaths) + "          ").slice(0, 10) + "\n" +
            "Kinetic    | " + (beautifyNumber(kineticKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(kineticDeaths) + "          ").slice(0, 10) + "\n" +
            "Storm      | " + (beautifyNumber(stormKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(stormDeaths) + "          ").slice(0, 10) + "\n" +
            "Toxic      | " + (beautifyNumber(toxicKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(toxicDeaths) + "          ").slice(0, 10) + "\n" +
            "Wither     | " + (beautifyNumber(witherKills) + "          ").slice(0, 10) + "| " + (beautifyNumber(witherDeaths) + "          ").slice(0, 10) + "\n" +
            "```";


            return {
                embeds: [
                    {
                        author: {
                            name: "Wizards"
                        },
                        title: rankPrefix + username,
                        url: "https://www.plotzes.ml/stats/" + uuid,
                        color: parseInt("76cc00", 16),
                        fields: [
                            {
                                name: "Wins",
                                value: "`" + beautifyNumber(wins) + "`",
                                inline: true
                            },
                            {
                                name: "Kills",
                                value: "`" + beautifyNumber(kills) + "`",
                                inline: true
                            },
                            {
                                name: "Deaths",
                                value: "`" + beautifyNumber(deaths) + "`",
                                inline: true
                            },
                            {
                                name: "Assists",
                                value: "`" + beautifyNumber(assists) + "`",
                                inline: true
                            },
                            {
                                name: "K/D Ratio",
                                value: "`" + beautifyNumber(killDeathRatio) + "`",
                                inline: true
                            },
                            {
                                name: "Points Captured",
                                value: "`" + beautifyNumber(pointsCaptured) + "`",
                                inline: true
                            },
                            {
                                name: "Selected Class",
                                value: "`" + selectedClass + "`",
                                inline: true
                            },
                            {
                                name: "Airtime",
                                value: "`" + beautifyNumber(airtime) + "`",
                                inline: true
                            },
                            {
                                name: "Class Specific Stats",
                                value: table
                            }
                        ],
                        thumbnail: {
                            url: "https://www.mc-heads.net/body/" + uuid + "/left"
                        },
                        footer: {
                            text: "Choose a game below."
                        }
                    }
                ],
                components: menu
            }
            break;


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
            break;
    }
}