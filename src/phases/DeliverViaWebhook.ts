export class DeliverViaWebhook {
  static async execute(inputs: Record<string, any>): Promise<void> {
    const targetUrl: string = inputs["Target URL"];
    const body: string = inputs["Body"];

    try {
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        throw new Error(`Invalid URL: ${targetUrl}`);
      }

      const response = await fetch(parsedUrl.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        throw new Error(
          `Webhook responded with status ${response.status} ${response.statusText}`
        );
      }

      console.log(`Webhook delivered successfully to ${targetUrl}`);
    } catch (err: any) {
      console.error("Webhook delivery failed:", err.message);
      throw new Error(`Failed to deliver via webhook: ${err.message}`);
    }
  }
}
