const Pubnub = require("pubnub")

var pubnub = new Pubnub({
    publishKey: "pub-c-8a75198e-e9b5-4595-9707-7bee8da7c913",
    subscribeKey: "sub-c-c1f806e6-b3b7-4a4c-8f76-7d9a54d67477",
    userId: 'myUniqueUserId'
})

module.exports = pubnub;

