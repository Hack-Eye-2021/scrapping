import parse from "../parse/parser";
import fetchHTML from "../fetch/fetcher";
import persist from "../persist/persistor";
const MAX = 2
const OFFSET = 0
const BASE_URL = 'https://www.infobae.com'
const LANDING_PAGE_SCHEMA = {
    urls: {
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

const parseArticle = (page) => parse(ARTICLE_SCHEMA, page)
const fetchArticle = (url) => fetchHTML(url.value, {host: BASE_URL})
const scrapInfobae = async () => {

    const landingPage = await fetchHTML(BASE_URL)
    const { urls } = parse(LANDING_PAGE_SCHEMA, landingPage)
    const articlesPages = await Promise.all(urls.slice(OFFSET, MAX).map(fetchArticle))
    const articles = articlesPages.map(parseArticle)
    return persist('INFOBAE', articles)

}

export default scrapInfobae