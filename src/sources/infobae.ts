import parse from "../parse/parser";
import fetchHTML from "../fetch/fetcher";
import persist from "../persist/persistor";
import {DataElement, Html, Url} from "../models/models";
import {PromiseAll} from "../utils/batch";

const BATCH_SIZE = 5
const BASE_URL = 'https://www.infobae.com'
const LANDING_PAGE_SCHEMA = {
    relativeURLs: {
        listItem: 'a[rel=canonical]',
        data: {
            value: {
                attr: 'href'
            }
        }
    }
}
const ARTICLE_SCHEMA = {
    title: 'h1',
    subtitle: '.article-subheadline',
    paragraphs: {
        listItem: '.paragraph'
    }
}

const parseArticle: ([url, page]: [Url, Html]) => DataElement = ([url, page]) => {
    console.log(`parsing ${url.value}`)
    const {title, subtitle, paragraphs} = parse(ARTICLE_SCHEMA, page)
    return {url: url.value, data: {title, content: [subtitle, ...paragraphs]}}
}

const fetchArticle: (url: Url) => Promise<[Url, Html]> = async (url) => [url, await fetchHTML(url.value)]

const scrapInfobae = async () => {

    const start = new Date().getTime()
    console.log('scrapping infobae')
    const landingPage: Html = await fetchHTML(BASE_URL)
    const {relativeURLs} = parse(LANDING_PAGE_SCHEMA, landingPage)
    const urls = relativeURLs.map(url => ({value: BASE_URL + url.value}))
    const articles = await PromiseAll(urls, fetchArticle, BATCH_SIZE)
    const parsedArticles: DataElement[] = await Promise.all(articles.map(parseArticle))
    const res =  persist('INFOBAE', parsedArticles)
    console.log('scrapped infobae in ' + (new Date().getTime() - start) + ' millis')
    return res

}

export default scrapInfobae