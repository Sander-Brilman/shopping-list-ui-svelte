class ApiClient
{
    private apiUrl:string = import.meta.env.VITE_API_URL;

    private async makeRequest<Type>(endpoint: string, method: string, body: object | null): Promise<Type | null> {

        let response = await fetch(`${this.apiUrl}/api${endpoint}`, {
            method: method,
            body: body != null ? JSON.stringify(body) : null,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })

        try {
            return await response.json();
        }
        catch(e) {
            console.log(`failed to parse json response from a ${method} request to ${endpoint}`);
        }

        return null;
    }

    public async get<TResult>(relativeEndpoint: string): Promise<Awaited<TResult | null>> {
        return await this.makeRequest<TResult>(relativeEndpoint, "GET", null)
    }

    public async postRequest<TResult>(endpoint: string, body: object): Promise<Awaited<TResult | null>> {
        return await this.makeRequest<TResult>(endpoint, "POST", body);
    }

    public async patchRequest(endpoint: string, body: object): Promise<void> {
        await this.makeRequest<void>(endpoint, "PATCH", body);
    }

    public async patchRequestWithResult<TResult>(endpoint: string, body: object): Promise<Awaited<TResult | null>> {
        return await this.makeRequest<TResult>(endpoint, "PATCH", body);
    }

    public async deleteRequest(endpoint: string) {
        await this.makeRequest(endpoint, "DELETE", null);
    }
}

export const apiClient = new ApiClient();