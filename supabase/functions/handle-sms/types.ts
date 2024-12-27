export interface TwilioMessage {
  Body: string;
  From: string;
}

export interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    }
  }>
}