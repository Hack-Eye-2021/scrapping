import fetch from "node-fetch";
import {DataElement} from "../models/models";
import {PromiseAll} from "../utils/batch";
import Source from "./sources";
import {TwitterStatus, TwitterTrends} from "../models/twitter";

const MAX_TWEETS_PER_TT = 5;
const BATCH_SIZE = 5

const twitterFetch = (url: string) => {
    return fetch(
        url,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAACbKTQEAAAAALN7G7nDUpfBOHf%2BTElkU7rf%2Bqyk%3Dcm1yWZ8omgcuodWRMPxPoglJU8cg6XjIJTJ5kawLTyqneZ3r7j',

            }
        })
        .then(data => data.json());
}

const parseStatus = (title: string, status: TwitterStatus): DataElement => {
    const content = status.full_text
        .replace(/\n/g, "")
        .replace(/http[^\s]*/g, "")
    return {
        url: `https://twitter.com/i/web/status/${status.id}`,
        data: {
            title,
            content
        }
    }
};

const fetchTrendingTopicsTweets = async (trendingTopic: TwitterTrends): Promise<DataElement[]> => {
    console.log('fetching trending topic: ' + trendingTopic.name)

    const params = new URLSearchParams(
        {
            q: `"${trendingTopic.query}" AND -filter:retweets`,
            result_type: "popular",
            count: MAX_TWEETS_PER_TT.toString(),
            include_entities: "false",
            tweet_mode: "extended",
            lang: "es"
        }
    );

    const fetchedTrendingTopicsTweets = await twitterFetch(
        `https://api.twitter.com/1.1/search/tweets.json?${params}`
    );

    return fetchedTrendingTopicsTweets
        .statuses
        .map((status) => {
            return parseStatus(trendingTopic.name, status);
        })
}

// 23424747 = Argentina code
const fetchTrendingTopics = async (): Promise<TwitterTrends[]> => {
    const trendingTopics = await twitterFetch("https://api.twitter.com/1.1/trends/place.json?id=23424747")

    return trendingTopics[0].trends;
}

export default class Twitter implements Source {

    async getContents(){
        const trendingTopics: TwitterTrends[] = await fetchTrendingTopics();
        return (await PromiseAll(trendingTopics, fetchTrendingTopicsTweets, BATCH_SIZE)).flat()
    }

    async getContent() {
        return Promise.reject(new Error("Method not implemented"))
    }
}