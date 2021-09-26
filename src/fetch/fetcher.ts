import fetch from 'node-fetch'
import puppeteer, {Browser} from 'puppeteer'
import {Html} from "../models/models";

const config = {
    js: false
}

let savedBrowser
const getBrowser: () => Promise<Browser> = async () => {
    if (savedBrowser){
        return savedBrowser
    }else{
        savedBrowser = await puppeteer.launch();
        return savedBrowser
    }
}

const fetchHTML = async (url: string): Promise<Html>  => {

    console.log(`fetching ${url}`)
    if (config.js){
        return fetchHTMLWithJS(url)
    }else {
        return fetchHTMLWithoutJS(url)
    }

}

const fetchHTMLWithoutJS = async (url: string): Promise<string>  => {

    const res = await fetch(url)
    return await res.text()
}

const fetchHTMLWithJS = async (url: string): Promise<string>  => {
    const browser = await getBrowser()
    const page = await browser.newPage();
    await page.goto(url);
    return await page.evaluate(() => document?.documentElement?.outerHTML)
}

export default fetchHTML