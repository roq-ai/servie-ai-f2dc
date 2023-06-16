import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { automatedCallRuleValidationSchema } from 'validationSchema/automated-call-rules';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAutomatedCallRules();
    case 'POST':
      return createAutomatedCallRule();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAutomatedCallRules() {
    const data = await prisma.automated_call_rule
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'automated_call_rule'));
    return res.status(200).json(data);
  }

  async function createAutomatedCallRule() {
    await automatedCallRuleValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.automated_call_rule.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
