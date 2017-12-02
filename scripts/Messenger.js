/**
 * This pub/sub system is a light wrapper
 * around a collection of jQuery.Callbacks. This is based on code from
 * https://api.jquery.com/jQuery.Callbacks/
 * but written as an ES6 class to be cleaner. 
 */
class Messenger {
    constructor() {
        this.handlers = {};
    }

    /**
     * Ensure that a jQuery.Callbacks object
     * exists for the given topic. Then return the Callbacks object.
     */
    get_topic_callbacks(topic) {
        if (!(topic in this.handlers))
            this.handlers[topic] = $.Callbacks();
        return this.handlers[topic];
    }

    /**
     * Publish a message on the given topic.
     */
    publish(topic, message) {
        this.get_topic_callbacks(topic).fire(message);
    }

    /**
     * Subscribe to a topic by storing a callback.
     */
    subscribe(topic, callback) {
        this.get_topic_callbacks(topic).add(callback);
    }

    /**
     * Unsubscribe from a topic.
     */
    unsubscribe(topic, callback) {
        this.get_topic_callbacks(topic).remove(callback);
    }
}
