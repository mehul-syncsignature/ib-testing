import {
  MailerLiteCreateSubscriberRequest,
  MailerLiteCreateSubscriberResponse,
  MailerLiteErrorResponse,
} from './types';

class MailerLiteClient {
  private apiKey: string;
  private baseUrl: string = 'https://connect.mailerlite.com/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      const error = data as MailerLiteErrorResponse;
      throw new Error(error.message || `MailerLite API error: ${response.status}`);
    }

    return data as T;
  }

  async createSubscriber(
    subscriberData: MailerLiteCreateSubscriberRequest
  ): Promise<MailerLiteCreateSubscriberResponse> {
    return this.makeRequest<MailerLiteCreateSubscriberResponse>('/subscribers', {
      method: 'POST',
      body: JSON.stringify(subscriberData),
    });
  }

  async getSubscriber(email: string): Promise<MailerLiteCreateSubscriberResponse | null> {
    try {
      return await this.makeRequest<MailerLiteCreateSubscriberResponse>(
        `/subscribers/${encodeURIComponent(email)}`
      );
    } catch (error) {
      // If subscriber doesn't exist, return null instead of throwing
      if (error instanceof Error && (
        error.message.includes('404') || 
        error.message.includes('No query results') ||
        error.message.includes('not found')
      )) {
        return null;
      }
      throw error;
    }
  }

  async updateSubscriber(
    email: string,
    subscriberData: Partial<MailerLiteCreateSubscriberRequest>
  ): Promise<MailerLiteCreateSubscriberResponse> {
    return this.makeRequest<MailerLiteCreateSubscriberResponse>(
      `/subscribers/${encodeURIComponent(email)}`,
      {
        method: 'PUT',
        body: JSON.stringify(subscriberData),
      }
    );
  }
}

export default MailerLiteClient;