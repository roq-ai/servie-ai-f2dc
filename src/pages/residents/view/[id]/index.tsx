import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getResidentById } from 'apiSdk/residents';
import { Error } from 'components/error';
import { ResidentInterface } from 'interfaces/resident';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteAutomatedCallRuleById } from 'apiSdk/automated-call-rules';
import { deleteAutomatedCallStatusById } from 'apiSdk/automated-call-statuses';

function ResidentViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ResidentInterface>(
    () => (id ? `/residents/${id}` : null),
    () =>
      getResidentById(id, {
        relations: ['facility', 'automated_call_rule', 'automated_call_status'],
      }),
  );

  const automated_call_ruleHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAutomatedCallRuleById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const automated_call_statusHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAutomatedCallStatusById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Resident Detail View
          </Text>
          {hasAccess('resident', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/residents/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  First Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.first_name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Last Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.last_name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Phone Number:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.phone_number}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('facility', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    Facility:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/facilities/view/${data?.facility?.id}`}>
                      {data?.facility?.name}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('automated_call_rule', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Automated Call Rules
                    </Text>
                    <NextLink passHref href={`/automated-call-rules/create?resident_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>rule_type</Th>
                          <Th>time</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.automated_call_rule?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/automated-call-rules/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.rule_type}</Td>
                            <Td>{record.time as unknown as string}</Td>
                            <Td>
                              {hasAccess(
                                'automated_call_rule',
                                AccessOperationEnum.UPDATE,
                                AccessServiceEnum.PROJECT,
                              ) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/automated-call-rules/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess(
                                'automated_call_rule',
                                AccessOperationEnum.DELETE,
                                AccessServiceEnum.PROJECT,
                              ) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    automated_call_ruleHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('automated_call_status', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Automated Call Statuses
                    </Text>
                    <NextLink passHref href={`/automated-call-statuses/create?resident_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>status</Th>
                          <Th>call_time</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.automated_call_status?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/automated-call-statuses/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.status}</Td>
                            <Td>{record.call_time as unknown as string}</Td>
                            <Td>
                              {hasAccess(
                                'automated_call_status',
                                AccessOperationEnum.UPDATE,
                                AccessServiceEnum.PROJECT,
                              ) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/automated-call-statuses/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess(
                                'automated_call_status',
                                AccessOperationEnum.DELETE,
                                AccessServiceEnum.PROJECT,
                              ) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    automated_call_statusHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box></Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'resident',
  operation: AccessOperationEnum.READ,
})(ResidentViewPage);
