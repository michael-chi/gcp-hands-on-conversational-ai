const { PubSub } = require('@google-cloud/pubsub');

class EventPublisher {
    constructor(config) {

    }

    async publish(topicName, stringEvent) {
        try {
            console.log(`[Info]Publishing to ${topicName}.`);
            const pubsub = new PubSub();
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