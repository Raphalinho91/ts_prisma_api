import { PrismaClient, Session } from "@prisma/client";

interface ISessionService {
  createSession(userId: string, token: string): Promise<Session>;
  invalidateOldSession(userId: string): Promise<void>;
  findSessionByToken(token: string): Promise<Session | null>;
}

export class SessionService implements ISessionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createSession(userId: string, token: string): Promise<Session> {
    return await this.prisma.session.create({
      data: {
        userId,
        token,
      },
    });
  }

  async invalidateOldSession(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    return await this.prisma.session.findFirst({
      where: { token },
    });
  }
}
