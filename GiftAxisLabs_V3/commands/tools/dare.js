module.exports = {
    name: "dare",
    async execute(sock, m, args, reply) {
        const dares = [
            "Send a voice note singing your favorite song!", "Change your profile picture to a funny face for 1 hour!",
            "Text your crush right now!", "Do 20 push-ups and send a video!",
            "Post a funny status on WhatsApp!", "Send a voice note doing your best animal impression!",
            "Let someone else type your next 3 messages!", "Call the 5th contact in your phone!",
            "Send a selfie with no filter!", "Type with your eyes closed for the next 2 minutes!"
        ];
        reply(`😈 *Dare:*\n\n${dares[Math.floor(Math.random() * dares.length)]}`);
    }
};
