import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { automatedCallRuleValidationSchema } from 'validationSchema/automated-call-rules';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.automated_call_rule
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAutomatedCallRuleById();
    case 'PUT':
      return updateAutomatedCallRuleById();
    case 'DELETE':
      return deleteAutomatedCallRuleById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAutomatedCallRuleById() {
    const data = await prisma.automated_call_rule.findFirst(convertQueryToPrismaUtil(req.query, 'automated_call_rule'));
    return res.status(200).json(data);
  }

  async function updateAutomatedCallRuleById() {
    await automatedCallRuleValidationSchema.validate(req.body);
    const data = await prisma.automated_call_rule.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAutomatedCallRuleById() {
    const data = await prisma.automated_call_rule.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
