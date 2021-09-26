import scrapeIt, {ScrapeOptions} from "scrape-it";
import {Html} from "../models/models";


const parse = <T> ( schema: ScrapeOptions, html: Html): any => {
    return scrapeIt.scrapeHTML(html, schema)
}

export default parse