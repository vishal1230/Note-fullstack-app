// This file augments the existing Request type from the Express library.
// It tells TypeScript that we are adding a custom 'user' property to it.

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
  }
}