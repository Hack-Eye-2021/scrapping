## Hawk Eye Scrapping

### Sources

#### Infobae

For this source, hawk eye scraps on each run only the articles that appear on the landing page.

For each article, the title, the subtitle and the body are consumed.

#### Twitter

For this source, hack eye scraps the current trending topics.

For each trending topic, the first 100 tweets are consumed.

#### Youtube

For this source, hack eye scraps, on each run, only the videos that shows up on the landing page. 

For each video, the description and the first 50 comments are consumed.

### Persistence

For each source a JSON file will be generated. Those JSON files are saved locally for development, and in an S3 bucket for productive deployment

```typescript
type DataElement = {
    url: string,
    data: {
        title: string,
        content: string[]
    }
}
```
###

Developing notes:

- Node.js version 16.6.2