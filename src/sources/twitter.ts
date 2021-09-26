import fetch from "node-fetch";
import {DataElement} from "../models/models";
import persist from "../persist/persistor";
import {PromiseAll} from "../utils/batch";

const MAX_TWEETS_PER_TT = 10;
const BATCH_SIZE = 5

const twitterFetch = (url: string) => {
    return fetch(
        url,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + process.env.TWITTER_BEARER,

            }
        })
        .then(data => data.json());
}

const parseStatus = (title: string, status: TwitterStatus): DataElement => {
    return {
        url: `https://twitter.com/i/web/status/${status.id}`,
        data: {
            title,
            content: [status.full_text]
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
            tweet_mode: "extended"
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

const fetchTrendingTopics = async (): Promise<TwitterTrends[]> => {
    const trendingTopics = await twitterFetch("https://api.twitter.com/1.1/trends/place.json?id=1")

    return trendingTopics[0].trends;
}


const scrapTwitter = async () => {
    console.log('scrapping twitter')
    const start = new Date().getTime()
    const trendingTopics: TwitterTrends[] = await fetchTrendingTopics();

    const tweets = (await PromiseAll(trendingTopics, fetchTrendingTopicsTweets, BATCH_SIZE)).flat()

    await persist("TWITTER", tweets)
    console.log('scrapped twitter in: ' + (new Date().getTime() - start) + ' millis.')

}


export default scrapTwitter