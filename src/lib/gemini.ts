export const parseJobWithGemini = async (prompt: string): Promise<any> => {
    try {
        const response = await fetch('/.netlify/functions/parse-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'The request could not be understood.');
        }

        const parsedJson = await response.json();
        
        if (!parsedJson.job) {
             throw new Error("AI could not structure job data from the response.");
        }
        return parsedJson.job;

    } catch (error) {
        console.error("Error calling parse-job function:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        // Provide a more helpful error message to the end-user.
        throw new Error(message);
    }
};