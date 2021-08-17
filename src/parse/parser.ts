import scrapeIt, {ScrapeOptions} from "scrape-it";


const parse = <T> ( schema: ScrapeOptions, html): any => {
    return scrapeIt.scrapeHTML(html, schema)
}

export default parse