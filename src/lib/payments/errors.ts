/** Thrown when required env vars (keys/URLs) are missing. Maps to HTTP 503. */
export class PaymentConfigError extends Error {}

/** Thrown when a gateway rejects or fails a request. Maps to HTTP 502. */
export class PaymentGatewayError extends Error {}
