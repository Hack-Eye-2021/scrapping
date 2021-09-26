export const PromiseAll = async <T, U> (items: T[], mapper: (T) => Promise<U>, size: number) => {
    let position = 0;
    let results: U[] = []
    while(position < items.length){
        const currents = items.slice(position, position + size)
        results = [...results, ... await Promise.all(currents.map(mapper))]
        position += size
    }
    return results
}