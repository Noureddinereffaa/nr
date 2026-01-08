export async function submitToIndexNow(urls: string[], key: string) {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'nr-os.vercel.app';
    const keyLocation = `https://${host}/${key}.txt`;

    const body = {
        host,
        key,
        keyLocation,
        urlList: urls
    };

    try {
        // Submit to Bing (IndexNow is shared, so submitting to one engine is enough usually, but Bing is the primary)
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body),
        });

        if (response.status === 200 || response.status === 202) {
            return { success: true, message: 'URLs submitted successfully' };
        } else {
            return { success: false, message: `Failed with status: ${response.status}` };
        }
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
}
