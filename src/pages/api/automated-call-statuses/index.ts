import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { automatedCallStatusValidationSchema } from 'validationSchema/automated-call-statuses';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAutomatedCallStatuses();
    case 'POST':
      return createAutomatedCallStatus();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAutomatedCallStatuses() {
    const data = await prisma.automated_call_status
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'automated_call_status'));
    return res.status(200).json(data);
  }

  async function createAutomatedCallStatus() {
    await automatedCallStatusValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.automated_call_status.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
