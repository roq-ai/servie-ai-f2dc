import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { automatedCallStatusValidationSchema } from 'validationSchema/automated-call-statuses';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.automated_call_status
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAutomatedCallStatusById();
    case 'PUT':
      return updateAutomatedCallStatusById();
    case 'DELETE':
      return deleteAutomatedCallStatusById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAutomatedCallStatusById() {
    const data = await prisma.automated_call_status.findFirst(
      convertQueryToPrismaUtil(req.query, 'automated_call_status'),
    );
    return res.status(200).json(data);
  }

  async function updateAutomatedCallStatusById() {
    await automatedCallStatusValidationSchema.validate(req.body);
    const data = await prisma.automated_call_status.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAutomatedCallStatusById() {
    const data = await prisma.automated_call_status.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
