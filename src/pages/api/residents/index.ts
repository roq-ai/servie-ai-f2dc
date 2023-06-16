import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { residentValidationSchema } from 'validationSchema/residents';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getResidents();
    case 'POST':
      return createResident();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getResidents() {
    const data = await prisma.resident
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'resident'));
    return res.status(200).json(data);
  }

  async function createResident() {
    await residentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.automated_call_rule?.length > 0) {
      const create_automated_call_rule = body.automated_call_rule;
      body.automated_call_rule = {
        create: create_automated_call_rule,
      };
    } else {
      delete body.automated_call_rule;
    }
    if (body?.automated_call_status?.length > 0) {
      const create_automated_call_status = body.automated_call_status;
      body.automated_call_status = {
        create: create_automated_call_status,
      };
    } else {
      delete body.automated_call_status;
    }
    const data = await prisma.resident.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
