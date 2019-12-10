const { PubSub } = require('@google-cloud/pubsub');

class EventPublisher {
    constructor(config) {

    }

    async getTopic(topicName) {
        const pubsub = new PubSub();
        try {
            var topic = await pubsub.createTopic(topicName);
            return topic;
        } catch (ex) {
            console.error(`[ERROR]Unable to getTopic ${topicName}`);
            console.error(`[ERROR]${ex}`);
            var topics = await pubsub.getTopics();
            topics.forEach(topic => {
                console.log(`[INFO]Checking ${topic} <=> ${topicName}`);
                if (topic.name == topicName) {
                    console.log('[INFO]Got IT!');
                    return topic;
                }
            });
            return null;
        }
    }

    async publish(topicName, stringEvent) {
        try {
            var topic = await this.getTopic(topicName);
            if (!topic) {
                throw `Unable to create or get topic: ${topicName}`;
            }
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