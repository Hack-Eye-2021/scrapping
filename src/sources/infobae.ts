import parse from "../parse/parser";
import fetchHTML from "../fetch/fetcher";
import {DataElement, Html} from "../models/models";
import Source from "./sources";

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

export default class Infobae implements Source {

    async getContents(){
        const landingPage: Html = await fetchHTML(BASE_URL)
        const {relativeURLs} = parse(LANDING_PAGE_SCHEMA, landingPage)
        return relativeURLs.map(u => ({url: `${BASE_URL}${u.value}`}))
    }

    async getContent(url) {
        const article = await fetchHTML(url)
        const {title, subtitle, paragraphs} = parse(ARTICLE_SCHEMA, article)
        return {title, content: [subtitle, ...paragraphs]}
    }

}