// src/app.d.ts
/// <reference types="lucia" />

declare namespace Lucia {
  // type Bet = import("@prisma/client").Bet
  type Auth = import("./lib/lucia").Auth;
  type DatabaseUserAttributes = {
    discordId: string
    name: string
    image_url: string
    points?: number
    // bets: Bet[]
  };
  type DatabaseSessionAttributes = {};
}