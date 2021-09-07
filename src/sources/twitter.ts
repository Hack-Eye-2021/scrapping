import fetch from "node-fetch";
import {DataElement} from "../models/models";
import persist from "../persist/persistor";

const MAX_TWEETS_PER_TT = 10;

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

    const params = new URLSearchParams(
        {
            q: `"${trendingTopic.query}" AND -filter:retweets`,
            result_type: "popular",
            count: MAX_TWEETS_PER_TT.toString(),
            include_entities: "false",
            tweet_mode: "extended"
        }
    );

    const fetchTrendingTopicsTweets = await twitterFetch(
        `https://api.twitter.com/1.1/search/tweets.json?${params}`
    );

    return fetchTrendingTopicsTweets
        .statuses
        .map((status) => {
            return parseStatus(trendingTopic.name, status);
        })
}

const fetchTrendingTopics = async (): Promise<TwitterTrends[]> => {
    const fetchTrendingTopics = await twitterFetch("https://api.twitter.com/1.1/trends/place.json?id=1")

    return fetchTrendingTopics[0].trends;
}


const scrapTwitter = async () => {

    const trendingTopics: TwitterTrends[] = await fetchTrendingTopics();

    const tweets = (
        await Promise.all(
            trendingTopics
                .map(async (tt) => await fetchTrendingTopicsTweets(tt))
        ))
        .flat()

    await persist("TWITTER", tweets)
}


export default scrapTwitter