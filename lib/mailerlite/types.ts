export interface MailerLiteSubscriber {
  email: string;
  fields?: {
    name?: string;
    last_name?: string;
    [key: string]: string | number | undefined;
  };
  groups?: string[];
  status?: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk';
}

export interface MailerLiteCreateSubscriberRequest {
  email: string;
  fields?: Record<string, string | number>;
  groups?: string[];
  status?: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk';
}

export interface MailerLiteGroup {
  id: string;
  name: string;
  active_count: number;
  sent_count: number;
  opens_count: number;
  open_rate: {
    float: number;
    string: string;
  };
  clicks_count: number;
  click_rate: {
    float: number;
    string: string;
  };
  unsubscribed_count: number;
  unconfirmed_count: number;
  bounced_count: number;
  junk_count: number;
  created_at: string;
}

export interface MailerLiteCreateSubscriberResponse {
  data: {
    id: string;
    email: string;
    status: string;
    source: string;
    sent: number;
    opens_count: number;
    clicks_count: number;
    open_rate: number;
    click_rate: number;
    ip_address: string | null;
    subscribed_at: string;
    unsubscribed_at: string | null;
    created_at: string;
    updated_at: string;
    fields: Record<string, string | number>;
    groups: Array<{
      id: string;
      name: string;
      active_count: number;
      sent_count: number;
      opens_count: number;
      open_rate: {
        float: number;
        string: string;
      };
      clicks_count: number;
      click_rate: {
        float: number;
        string: string;
      };
      unsubscribed_count: number;
      unconfirmed_count: number;
      bounced_count: number;
      junk_count: number;
      created_at: string;
    }>;
    location: {
      country_id: number;
      region_id: number;
      city_id: number;
    } | null;
    opted_in_at: string | null;
    optin_ip: string | null;
  };
}

export interface MailerLiteErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}