/**
 * commands/learning/labs.js
 * FreeCodeCamp-style AI-generated interactive coding labs.
 * Students request a topic, Gemini generates a structured lab,
 * students submit code, Gemini evaluates and gives feedback.
 * Labs are also served as beautiful HTML pages via ngrok.
 */

const gemini     = require("../../lib/geminiAgent");
const ldb        = require("../../lib/learningDB");
const config     = require("../../config");
const fileServer = require("../../lib/fileServer");

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatLab(lab) {
    return (
        `┌ ❏ ◆ ⌜💻 𝗟𝗔𝗕: ${lab.title.toUpperCase()}⌟ ◆\n│\n` +
        `├◆ 🗣️ Language: ${lab.language}\n` +
        `├◆ 🎯 Difficulty: ${lab.difficulty}\n` +
        `├◆ 🏆 XP Reward: ${lab.xpReward}\n│\n` +
        `├◆ 📌 Objective:\n├◆ ${lab.objective}\n│\n` +
        `├◆ 📖 Concept:\n├◆ ${lab.concept}\n│\n` +
        `├◆ 💡 Example:\n` +
        `├◆ \`\`\`${lab.language.toLowerCase()}\n${lab.example.code}\n\`\`\`\n` +
        `├◆ ${lab.example.explanation}\n│\n` +
        `├◆ 🧪 Challenge:\n` +
        `├◆ ${lab.challenge.instruction}\n│\n` +
        `├◆ 🚀 Starter Code:\n` +
        `├◆ \`\`\`${lab.language.toLowerCase()}\n${lab.challenge.starterCode}\n\`\`\`\n│\n` +
        `├◆ 💡 Hints:\n` +
        lab.challenge.hints.map(h => `├◆   • ${h}`).join("\n") + `\n│\n` +
        `├◆ 📤 Submit with: .submit <your code>\n` +
        `├◆ 🔑 Show answer: .labsolution\n` +
        `└ ❏`
    );
}

module.exports = [

    // ── .lab ──────────────────────────────────────────────────────────────────
    {
        name:        "lab",
        aliases:     ["startlab", "newlab", "coding"],
        description: "Generate an AI coding lab on any topic",
        category:    "learning",
        groupOnly:   true,
        usage:       ".lab <topic> [difficulty] e.g: .lab arrays beginner",
        async execute(sock, m, args, reply) {
            const from   = m.key.remoteJid;
            const sender = m.key.participant || m.key.remoteJid;

            if (!ldb.isLearningGroup(from)) return reply("❌ Not a Learning Group. Admin must run .setclass first.");

            if (!args.length) {
                return reply(
                    `┌ ❏ ◆ ⌜💻 𝗟𝗔𝗕 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥⌟ ◆\n│\n` +
                    `├◆ Usage: .lab <topic> [difficulty]\n│\n` +
                    `├◆ Examples:\n` +
                    `├◆   .lab variables beginner\n` +
                    `├◆   .lab for loops intermediate\n` +
                    `├◆   .lab recursion advanced\n` +
                    `├◆   .lab async/await intermediate\n` +
                    `├◆   .lab linked lists advanced\n│\n` +
                    `├◆ Difficulties: beginner | intermediate | advanced\n└ ❏`
                );
            }

            // Parse difficulty from last arg if valid
            const difficulties = ["beginner", "intermediate", "advanced"];
            let difficulty = "beginner";
            let topicArgs  = [...args];
            if (difficulties.includes(args[args.length - 1]?.toLowerCase())) {
                difficulty = topicArgs.pop().toLowerCase();
            }
            const topic = topicArgs.join(" ");

            const g = ldb.getLearningGroup(from);
            await reply(`⏳ Generating lab on *${topic}* (${difficulty})... Please wait!`);

            try {
                const lab = await gemini.generateLab(topic, difficulty, g.language);
                if (!lab || !lab.title) return reply("❌ Failed to generate lab. Try again.");

                // Store lab for this user
                ldb.setActiveLab(sender, lab);
                ldb.registerStudent(from, sender, m.pushName || sender.split("@")[0]);

                // Send WhatsApp text version
                await sock.sendMessage(from, {
                    text: formatLab(lab) + config.footer
                }, { quoted: m });

                // Also serve as beautiful HTML page via ngrok
                try {
                    const served = await fileServer.serveLabPage(lab, g.topic || "Coding Lab");
                    await sock.sendMessage(from, {
                        text:
                            `┌ ❏ ◆ ⌜🌐 𝗜𝗡𝗧𝗘𝗥𝗔𝗖𝗧𝗜𝗩𝗘 𝗟𝗔𝗕 𝗣𝗔𝗚𝗘⌟ ◆\n│\n` +
                            `├◆ 💻 Open in browser to try code live:\n│\n` +
                            `├◆ 🔗 ${served.url}\n│\n` +
                            `├◆ ✨ Has live code editor, hints, tests!\n` +
                            `├◆ ⏰ Link valid for 24 hours\n└ ❏` + config.footer
                    }, { quoted: m });
                } catch(e) { /* ngrok not running — no problem, WhatsApp version was sent */ }

            } catch (e) {
                await reply(`❌ Lab generation failed: ${e.message}`);
            }
        }
    },

    // ── .submit ───────────────────────────────────────────────────────────────
    {
        name:        "submit",
        aliases:     ["submitcode", "mycode"],
        description: "Submit your code solution for the active lab",
        category:    "learning",
        groupOnly:   true,
        usage:       ".submit <your code>",
        async execute(sock, m, args, reply) {
            const from   = m.key.remoteJid;
            const sender = m.key.participant || m.key.remoteJid;

            if (!ldb.isLearningGroup(from)) return;

            const activeLab = ldb.getActiveLab(sender);
            if (!activeLab) {
                return reply("❌ You don't have an active lab. Use .lab <topic> to start one!");
            }

            const code = args.join(" ").trim();
            if (!code) return reply("❌ Please include your code: .submit <your code>");

            ldb.incrementLabAttempts(sender);
            const attemptNum = activeLab.attempts + 1;

            await reply(`⏳ Evaluating your code (attempt #${attemptNum})...`);

            try {
                const result = await gemini.evaluateCode(activeLab, code);
                const name   = m.pushName || sender.split("@")[0];

                if (result.passed) {
                    ldb.completeLab(sender, from, activeLab.title, result.xpEarned || activeLab.xpReward);

                    // Serve the solution code as a downloadable page
                    let codeUrl = "";
                    try {
                        const served = await fileServer.serveCodePage(code, activeLab.language || "javascript", `Solution — ${activeLab.title}`);
                        codeUrl = `\n├◆ 📥 Download your solution: ${served.url}\n`;
                    } catch(e) {}

                    await sock.sendMessage(from, {
                        text:
                            `┌ ❏ ◆ ⌜✅ 𝗟𝗔𝗕 𝗣𝗔𝗦𝗦𝗘𝗗!⌟ ◆\n│\n` +
                            `├◆ 🎉 Well done, *${name}*!\n` +
                            `├◆ 📊 Score: ${result.score}/100\n` +
                            `├◆ ✅ Tests: ${result.testsPassed}/${result.testsTotal}\n` +
                            `├◆ ⭐ XP Earned: +${result.xpEarned}\n│\n` +
                            `├◆ 📝 Feedback:\n├◆ ${result.feedback}\n│\n` +
                            (result.codeQuality ? `├◆ 🎨 Code Quality: ${result.codeQuality}\n│\n` : "") +
                            codeUrl +
                            (activeLab.bonusChallenge ? `├◆ 🔥 Bonus: ${activeLab.bonusChallenge}\n│\n` : "") +
                            `└ ❏` + config.footer,
                        mentions: [sender]
                    }, { quoted: m });

                } else {
                    await sock.sendMessage(from, {
                        text:
                            `┌ ❏ ◆ ⌜❌ 𝗡𝗢𝗧 𝗬𝗘𝗧, *${name}*⌟ ◆\n│\n` +
                            `├◆ 📊 Score: ${result.score}/100\n` +
                            `├◆ ✅ Tests: ${result.testsPassed}/${result.testsTotal}\n│\n` +
                            `├◆ 💬 Feedback:\n├◆ ${result.feedback}\n│\n` +
                            (result.corrections ? `├◆ 🔧 Fix this:\n├◆ ${result.corrections}\n│\n` : "") +
                            `├◆ 💡 Re-submit with .submit <code>\n` +
                            `├◆ 🔑 Or see solution: .labsolution\n└ ❏` + config.footer,
                        mentions: [sender]
                    }, { quoted: m });
                }

            } catch (e) {
                await reply(`❌ Evaluation error: ${e.message}`);
            }
        }
    },

    // ── .labsolution ──────────────────────────────────────────────────────────
    {
        name:        "labsolution",
        aliases:     ["solution", "labans", "showsolution"],
        description: "Reveal the solution for your active lab",
        category:    "learning",
        groupOnly:   true,
        async execute(sock, m, args, reply) {
            const sender    = m.key.participant || m.key.remoteJid;
            const activeLab = ldb.getActiveLab(sender);
            if (!activeLab) return reply("❌ No active lab. Use .lab <topic> to start one.");

            // Serve solution as downloadable code page
            let codeUrl = "";
            try {
                const served = await fileServer.serveCodePage(
                    activeLab.solution || activeLab.challenge?.starterCode || "// No solution available",
                    activeLab.language || "javascript",
                    `Solution — ${activeLab.title}`
                );
                codeUrl = `\n├◆ 📥 Download solution: ${served.url}`;
            } catch(e) {}

            await sock.sendMessage(m.key.remoteJid, {
                text:
                    `┌ ❏ ◆ ⌜🔑 𝗟𝗔𝗕 𝗦𝗢𝗟𝗨𝗧𝗜𝗢𝗡⌟ ◆\n│\n` +
                    `├◆ 📖 ${activeLab.title}\n│\n` +
                    `├◆ \`\`\`${activeLab.language?.toLowerCase() || "js"}\n${activeLab.solution || activeLab.challenge?.starterCode}\n\`\`\`\n│\n` +
                    `├◆ ⚠️ Study this, don't just copy!\n` +
                    `├◆ 💡 Try to understand every line.` +
                    codeUrl +
                    `\n└ ❏` + config.footer
            }, { quoted: m });
        }
    },

    // ── .curriculum ───────────────────────────────────────────────────────────
    {
        name:        "curriculum",
        aliases:     ["syllabus", "coursemap"],
        description: "Generate an AI learning curriculum for the group",
        category:    "learning",
        groupOnly:   true,
        adminOnly:   true,
        usage:       ".curriculum [weeks] e.g: .curriculum 4",
        async execute(sock, m, args, reply) {
            const from = m.key.remoteJid;
            if (!ldb.isLearningGroup(from)) return reply("❌ Not a Learning Group.");

            const g     = ldb.getLearningGroup(from);
            const weeks = parseInt(args[0]) || 4;
            if (weeks < 1 || weeks > 12) return reply("❌ Weeks must be between 1 and 12.");

            await reply(`⏳ Building ${weeks}-week curriculum for *${g.topic}* in *${g.language}*...`);

            try {
                const curriculum = await gemini.generateCurriculum(g.topic, g.language, weeks);
                if (!curriculum) return reply("❌ Could not generate curriculum.");

                let text = `┌ ❏ ◆ ⌜📚 ${curriculum.title.toUpperCase()}⌟ ◆\n│\n`;
                text += `├◆ ${curriculum.description}\n│\n`;

                for (const w of curriculum.weeks) {
                    text += `├◆ ─── Week ${w.week}: ${w.theme} ───\n`;
                    text += `├◆ Topics: ${w.topics.join(", ")}\n`;
                    text += `├◆ Labs: ${w.labSuggestions.join(" | ")}\n`;
                    text += `├◆ Assignment: ${w.assignment}\n`;
                    text += `├◆ Goal: ${w.goal}\n│\n`;
                }
                text += `└ ❏`;

                await sock.sendMessage(from, { text: text + config.footer }, { quoted: m });

                // Serve full curriculum as a nice HTML page
                try {
                    const currHtml = buildCurriculumHTML(curriculum, g);
                    const served = await fileServer.serveFile(currHtml, `curriculum_${g.language}_${weeks}wk.html`);
                    await sock.sendMessage(from, {
                        text: `📚 *Full Curriculum Page:*\n🔗 ${served.url}\n_View the complete ${weeks}-week curriculum in your browser!_` + config.footer
                    }, { quoted: m });
                } catch(e) {}

            } catch (e) {
                await reply(`❌ Curriculum error: ${e.message}`);
            }
        }
    },

    // ── .labstats ─────────────────────────────────────────────────────────────
    {
        name:        "labstats",
        aliases:     ["mylabs", "labhistory"],
        description: "View your completed labs",
        category:    "learning",
        async execute(sock, m, args, reply) {
            const sender = m.key.participant || m.key.remoteJid;
            const stats  = ldb.getLabStats(sender);

            if (!stats.completed) return reply("You haven't completed any labs yet! Use .lab <topic> to start.");

            const recent = stats.history.slice(-5).reverse()
                .map((l, i) => `├◆ ${i+1}. ${l.title} — ${l.score}pts`)
                .join("\n");

            await reply(
                `┌ ❏ ◆ ⌜🧪 𝗠𝗬 𝗟𝗔𝗕𝗦⌟ ◆\n│\n` +
                `├◆ ✅ Completed: ${stats.completed}\n` +
                `├◆ ⭐ Lab XP: ${stats.xp}\n│\n` +
                `├◆ Recent:\n${recent}\n└ ❏`
            );
        }
    },

    // ── .ask ──────────────────────────────────────────────────────────────────
    {
        name:        "ask",
        aliases:     ["question", "tutor"],
        description: "Ask the AI tutor a programming question",
        category:    "learning",
        usage:       ".ask <your question>",
        async execute(sock, m, args, reply) {
            const from = m.key.remoteJid;
            if (!args.length) return reply("Usage: .ask <your programming question>");

            const question = args.join(" ");
            const lang     = ldb.isLearningGroup(from)
                ? (ldb.getLearningGroup(from)?.language || "JavaScript")
                : "JavaScript";

            await reply("🤔 Thinking...");
            try {
                const answer = await gemini.answerQuestion(question, lang);
                await sock.sendMessage(from, {
                    text: `🧑‍🏫 *AI Tutor:*\n\n${answer}` + config.footer
                }, { quoted: m });
            } catch (e) {
                await reply(`❌ Tutor error: ${e.message}`);
            }
        }
    },
];

// ── Curriculum HTML builder ────────────────────────────────────────────────────
function buildCurriculumHTML(curriculum, g) {
    const weeks = curriculum.weeks.map((w, i) => `
        <div class="week-card">
            <div class="week-header">
                <span class="week-num">Week ${w.week}</span>
                <span class="week-theme">${w.theme}</span>
            </div>
            <div class="week-body">
                <div class="row"><span class="lbl">📚 Topics</span><span>${w.topics.join(", ")}</span></div>
                <div class="row"><span class="lbl">🧪 Labs</span><span>${w.labSuggestions.join(" • ")}</span></div>
                <div class="row"><span class="lbl">📝 Assignment</span><span>${w.assignment}</span></div>
                <div class="row"><span class="lbl">🎯 Goal</span><span>${w.goal}</span></div>
            </div>
        </div>`).join("");
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${curriculum.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0} body{font-family:Inter,sans-serif;background:#0d1117;color:#e6edf3;padding:24px}
.header{text-align:center;padding:40px 20px;background:linear-gradient(135deg,#1a1f2e,#0d1117);border-radius:16px;margin-bottom:32px;border:1px solid #30363d}
h1{font-size:clamp(1.4rem,4vw,2rem);background:linear-gradient(90deg,#58a6ff,#bc8cff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{color:#8b949e;margin-top:8px;font-size:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;max-width:1100px;margin:0 auto}
.week-card{background:#161b22;border:1px solid #30363d;border-radius:12px;overflow:hidden}
.week-header{background:#1c2128;padding:14px 18px;display:flex;align-items:center;gap:12px}
.week-num{background:linear-gradient(135deg,#58a6ff,#bc8cff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700;font-size:14px}
.week-theme{font-weight:600;font-size:15px}
.week-body{padding:16px;display:flex;flex-direction:column;gap:10px}
.row{display:flex;flex-direction:column;gap:4px;font-size:13px;line-height:1.5}
.lbl{font-size:11px;color:#58a6ff;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.footer{text-align:center;padding:32px;color:#6e7681;font-size:12px;margin-top:24px}
</style></head><body>
<div class="header"><h1>${curriculum.title}</h1><div class="sub">${curriculum.description}</div><div class="sub" style="margin-top:4px">Language: ${g.language} · ${curriculum.weeks.length} Weeks · Generated by Gift Axis Labs™</div></div>
<div class="grid">${weeks}</div>
<div class="footer">Gift Axis Labs™ · ${new Date().toLocaleDateString()}</div>
</body></html>`;
}


// ── Helpers ───────────────────────────────────────────────────────────────────
function formatLab(lab) {
    return (
        `┌ ❏ ◆ ⌜💻 𝗟𝗔𝗕: ${lab.title.toUpperCase()}⌟ ◆\n│\n` +
        `├◆ 🗣️ Language: ${lab.language}\n` +
        `├◆ 🎯 Difficulty: ${lab.difficulty}\n` +
        `├◆ 🏆 XP Reward: ${lab.xpReward}\n│\n` +
        `├◆ 📌 Objective:\n├◆ ${lab.objective}\n│\n` +
        `├◆ 📖 Concept:\n├◆ ${lab.concept}\n│\n` +
        `├◆ 💡 Example:\n` +
        `├◆ \`\`\`${lab.language.toLowerCase()}\n${lab.example.code}\n\`\`\`\n` +
        `├◆ ${lab.example.explanation}\n│\n` +
        `├◆ 🧪 Challenge:\n` +
        `├◆ ${lab.challenge.instruction}\n│\n` +
        `├◆ 🚀 Starter Code:\n` +
        `├◆ \`\`\`${lab.language.toLowerCase()}\n${lab.challenge.starterCode}\n\`\`\`\n│\n` +
        `├◆ 💡 Hints:\n` +
        lab.challenge.hints.map(h => `├◆   • ${h}`).join("\n") + `\n│\n` +
        `├◆ 📤 Submit with: .submit <your code>\n` +
        `├◆ 🔑 Show answer: .labsolution\n` +
        `└ ❏`
    );
}

module.exports = [

    // ── .lab ──────────────────────────────────────────────────────────────────
    {
        name:        "lab",
        aliases:     ["startlab", "newlab", "coding"],
        description: "Generate an AI coding lab on any topic",
        category:    "learning",
        groupOnly:   true,
        usage:       ".lab <topic> [difficulty] e.g: .lab arrays beginner",
        async execute(sock, m, args, reply) {
            const from   = m.key.remoteJid;
            const sender = m.key.participant || m.key.remoteJid;

            if (!ldb.isLearningGroup(from)) return reply("❌ Not a Learning Group. Admin must run .setclass first.");

            if (!args.length) {
                return reply(
                    `┌ ❏ ◆ ⌜💻 𝗟𝗔𝗕 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥⌟ ◆\n│\n` +
                    `├◆ Usage: .lab <topic> [difficulty]\n│\n` +
                    `├◆ Examples:\n` +
                    `├◆   .lab variables beginner\n` +
                    `├◆   .lab for loops intermediate\n` +
                    `├◆   .lab recursion advanced\n` +
                    `├◆   .lab async/await intermediate\n` +
                    `├◆   .lab linked lists advanced\n│\n` +
                    `├◆ Difficulties: beginner | intermediate | advanced\n└ ❏`
                );
            }

            // Parse difficulty from last arg if valid
            const difficulties = ["beginner", "intermediate", "advanced"];
            let difficulty = "beginner";
            let topicArgs  = [...args];
            if (difficulties.includes(args[args.length - 1]?.toLowerCase())) {
                difficulty = topicArgs.pop().toLowerCase();
            }
            const topic = topicArgs.join(" ");

            const g = ldb.getLearningGroup(from);
            await reply(`⏳ Generating lab on *${topic}* (${difficulty})... Please wait!`);

            try {
                const lab = await gemini.generateLab(topic, difficulty, g.language);
                if (!lab || !lab.title) return reply("❌ Failed to generate lab. Try again.");

                // Store lab for this user
                ldb.setActiveLab(sender, lab);
                ldb.registerStudent(from, sender, m.pushName || sender.split("@")[0]);

                await sock.sendMessage(from, {
                    text: formatLab(lab) + config.footer
                }, { quoted: m });

            } catch (e) {
                await reply(`❌ Lab generation failed: ${e.message}`);
            }
        }
    },

    // ── .submit ───────────────────────────────────────────────────────────────
    {
        name:        "submit",
        aliases:     ["submitcode", "mycode"],
        description: "Submit your code solution for the active lab",
        category:    "learning",
        groupOnly:   true,
        usage:       ".submit <your code>",
        async execute(sock, m, args, reply) {
            const from   = m.key.remoteJid;
            const sender = m.key.participant || m.key.remoteJid;

            if (!ldb.isLearningGroup(from)) return;

            const activeLab = ldb.getActiveLab(sender);
            if (!activeLab) {
                return reply("❌ You don't have an active lab. Use .lab <topic> to start one!");
            }

            const code = args.join(" ").trim();
            if (!code) return reply("❌ Please include your code: .submit <your code>");

            ldb.incrementLabAttempts(sender);
            const attemptNum = activeLab.attempts + 1;

            await reply(`⏳ Evaluating your code (attempt #${attemptNum})...`);

            try {
                const result = await gemini.evaluateCode(activeLab, code);
                const name   = m.pushName || sender.split("@")[0];

                if (result.passed) {
                    ldb.completeLab(sender, from, activeLab.title, result.xpEarned || activeLab.xpReward);

                    await sock.sendMessage(from, {
                        text:
                            `┌ ❏ ◆ ⌜✅ 𝗟𝗔𝗕 𝗣𝗔𝗦𝗦𝗘𝗗!⌟ ◆\n│\n` +
                            `├◆ 🎉 Well done, *${name}*!\n` +
                            `├◆ 📊 Score: ${result.score}/100\n` +
                            `├◆ ✅ Tests: ${result.testsPassed}/${result.testsTotal}\n` +
                            `├◆ ⭐ XP Earned: +${result.xpEarned}\n│\n` +
                            `├◆ 📝 Feedback:\n├◆ ${result.feedback}\n│\n` +
                            (result.codeQuality ? `├◆ 🎨 Code Quality: ${result.codeQuality}\n│\n` : "") +
                            (activeLab.bonusChallenge ? `├◆ 🔥 Bonus: ${activeLab.bonusChallenge}\n│\n` : "") +
                            `└ ❏` + config.footer,
                        mentions: [sender]
                    }, { quoted: m });

                } else {
                    await sock.sendMessage(from, {
                        text:
                            `┌ ❏ ◆ ⌜❌ 𝗡𝗢𝗧 𝗬𝗘𝗧, *${name}*⌟ ◆\n│\n` +
                            `├◆ 📊 Score: ${result.score}/100\n` +
                            `├◆ ✅ Tests: ${result.testsPassed}/${result.testsTotal}\n│\n` +
                            `├◆ 💬 Feedback:\n├◆ ${result.feedback}\n│\n` +
                            (result.corrections ? `├◆ 🔧 Fix this:\n├◆ ${result.corrections}\n│\n` : "") +
                            `├◆ 💡 Re-submit with .submit <code>\n` +
                            `├◆ 🔑 Or see solution: .labsolution\n└ ❏` + config.footer,
                        mentions: [sender]
                    }, { quoted: m });
                }

            } catch (e) {
                await reply(`❌ Evaluation error: ${e.message}`);
            }
        }
    },

    // ── .labsolution ──────────────────────────────────────────────────────────
    {
        name:        "labsolution",
        aliases:     ["solution", "labans", "showsolution"],
        description: "Reveal the solution for your active lab",
        category:    "learning",
        groupOnly:   true,
        async execute(sock, m, args, reply) {
            const sender    = m.key.participant || m.key.remoteJid;
            const activeLab = ldb.getActiveLab(sender);
            if (!activeLab) return reply("❌ No active lab. Use .lab <topic> to start one.");

            await sock.sendMessage(m.key.remoteJid, {
                text:
                    `┌ ❏ ◆ ⌜🔑 𝗟𝗔𝗕 𝗦𝗢𝗟𝗨𝗧𝗜𝗢𝗡⌟ ◆\n│\n` +
                    `├◆ 📖 ${activeLab.title}\n│\n` +
                    `├◆ \`\`\`${activeLab.language.toLowerCase()}\n${activeLab.solution}\n\`\`\`\n│\n` +
                    `├◆ ⚠️ Study this, don't just copy!\n` +
                    `├◆ 💡 Try to understand every line.\n└ ❏` + config.footer
            }, { quoted: m });
        }
    },

    // ── .curriculum ───────────────────────────────────────────────────────────
    {
        name:        "curriculum",
        aliases:     ["syllabus", "coursemap"],
        description: "Generate an AI learning curriculum for the group",
        category:    "learning",
        groupOnly:   true,
        adminOnly:   true,
        usage:       ".curriculum [weeks] e.g: .curriculum 4",
        async execute(sock, m, args, reply) {
            const from = m.key.remoteJid;
            if (!ldb.isLearningGroup(from)) return reply("❌ Not a Learning Group.");

            const g     = ldb.getLearningGroup(from);
            const weeks = parseInt(args[0]) || 4;
            if (weeks < 1 || weeks > 12) return reply("❌ Weeks must be between 1 and 12.");

            await reply(`⏳ Building ${weeks}-week curriculum for *${g.topic}* in *${g.language}*...`);

            try {
                const curriculum = await gemini.generateCurriculum(g.topic, g.language, weeks);
                if (!curriculum) return reply("❌ Could not generate curriculum.");

                let text = `┌ ❏ ◆ ⌜📚 ${curriculum.title.toUpperCase()}⌟ ◆\n│\n`;
                text += `├◆ ${curriculum.description}\n│\n`;

                for (const w of curriculum.weeks) {
                    text += `├◆ ─── Week ${w.week}: ${w.theme} ───\n`;
                    text += `├◆ Topics: ${w.topics.join(", ")}\n`;
                    text += `├◆ Labs: ${w.labSuggestions.join(" | ")}\n`;
                    text += `├◆ Assignment: ${w.assignment}\n`;
                    text += `├◆ Goal: ${w.goal}\n│\n`;
                }
                text += `└ ❏`;

                await sock.sendMessage(from, { text: text + config.footer }, { quoted: m });
            } catch (e) {
                await reply(`❌ Curriculum error: ${e.message}`);
            }
        }
    },

    // ── .labstats ─────────────────────────────────────────────────────────────
    {
        name:        "labstats",
        aliases:     ["mylabs", "labhistory"],
        description: "View your completed labs",
        category:    "learning",
        async execute(sock, m, args, reply) {
            const sender = m.key.participant || m.key.remoteJid;
            const stats  = ldb.getLabStats(sender);

            if (!stats.completed) return reply("You haven't completed any labs yet! Use .lab <topic> to start.");

            const recent = stats.history.slice(-5).reverse()
                .map((l, i) => `├◆ ${i+1}. ${l.title} — ${l.score}pts`)
                .join("\n");

            await reply(
                `┌ ❏ ◆ ⌜🧪 𝗠𝗬 𝗟𝗔𝗕𝗦⌟ ◆\n│\n` +
                `├◆ ✅ Completed: ${stats.completed}\n` +
                `├◆ ⭐ Lab XP: ${stats.xp}\n│\n` +
                `├◆ Recent:\n${recent}\n└ ❏`
            );
        }
    },

    // ── .ask ──────────────────────────────────────────────────────────────────
    {
        name:        "ask",
        aliases:     ["question", "tutor"],
        description: "Ask the AI tutor a programming question",
        category:    "learning",
        usage:       ".ask <your question>",
        async execute(sock, m, args, reply) {
            const from = m.key.remoteJid;
            if (!args.length) return reply("Usage: .ask <your programming question>");

            const question = args.join(" ");
            const lang     = ldb.isLearningGroup(from)
                ? (ldb.getLearningGroup(from)?.language || "JavaScript")
                : "JavaScript";

            await reply("🤔 Thinking...");
            try {
                const answer = await gemini.answerQuestion(question, lang);
                await sock.sendMessage(from, {
                    text: `🧑‍🏫 *AI Tutor:*\n\n${answer}` + config.footer
                }, { quoted: m });
            } catch (e) {
                await reply(`❌ Tutor error: ${e.message}`);
            }
        }
    },
];
