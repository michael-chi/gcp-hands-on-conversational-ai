const { PubSub } = require('@google-cloud/pubsub');

class EventPublisher {
    constructor(config) {
        this.config = config;
    }

    async publish(topicName, stringEvent) {
        try {
            console.log(`[Info]Publishing to ${topicName}.`);
            var pubsub = null;
            if(this.config.projectId)
                pubsub = new PubSub({projectId:this.config.projectId});
            else
                pubsub = new PubSub();
            //const pubsub = new PubSub();
            const dataBuffer = Buffer.from(stringEvent);
            const messageId = await pubsub.topic(topicName).publish(dataBuffer);
            console.log(`[Info]Message ${messageId} published.`);

            return messageId;
        } catch (ex) {
            console.error(`[Error]${ex}`);
            return null;
        }
    }
}

module.exports = EventPublisher;