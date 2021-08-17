import fetch from 'node-fetch'
import puppeteer from 'puppeteer'
const config = {
    js: true
}
const fetchHTML = async (url: string, options: {host: string} = {host: ''}): Promise<string>  => {

    url = options.host + url
    console.log(`fetching ${url}`)
    if (config.js){
        return fetchHTMLWithJS(url)
    }else {
        return fetchHTMLWithJS(url)
    }

}

const fetchHTMLWithoutJS = async (url: string): Promise<string>  => {

    const res = await fetch(url)
    return await res.text()
}

const fetchHTMLWithJS = async (url: string): Promise<string>  => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const bodyHTML = await page.evaluate(() =>  document.documentElement.outerHTML);
    await browser.close();
    return bodyHTML
}

export default fetchHTML