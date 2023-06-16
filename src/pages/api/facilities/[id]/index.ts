import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { facilityValidationSchema } from 'validationSchema/facilities';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.facility
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFacilityById();
    case 'PUT':
      return updateFacilityById();
    case 'DELETE':
      return deleteFacilityById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFacilityById() {
    const data = await prisma.facility.findFirst(convertQueryToPrismaUtil(req.query, 'facility'));
    return res.status(200).json(data);
  }

  async function updateFacilityById() {
    await facilityValidationSchema.validate(req.body);
    const data = await prisma.facility.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteFacilityById() {
    const data = await prisma.facility.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
