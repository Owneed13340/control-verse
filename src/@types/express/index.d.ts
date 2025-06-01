import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
        // tu peux ajouter d'autres propriétés selon ton JWT
      };
    }
  }
}

