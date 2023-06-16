import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getAutomatedCallStatusById, updateAutomatedCallStatusById } from 'apiSdk/automated-call-statuses';
import { Error } from 'components/error';
import { automatedCallStatusValidationSchema } from 'validationSchema/automated-call-statuses';
import { AutomatedCallStatusInterface } from 'interfaces/automated-call-status';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ResidentInterface } from 'interfaces/resident';
import { getResidents } from 'apiSdk/residents';

function AutomatedCallStatusEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AutomatedCallStatusInterface>(
    () => (id ? `/automated-call-statuses/${id}` : null),
    () => getAutomatedCallStatusById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AutomatedCallStatusInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAutomatedCallStatusById(id, values);
      mutate(updated);
      resetForm();
      router.push('/automated-call-statuses');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AutomatedCallStatusInterface>({
    initialValues: data,
    validationSchema: automatedCallStatusValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Automated Call Status
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <FormControl id="call_time" mb="4">
              <FormLabel>Call Time</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.call_time ? new Date(formik.values?.call_time) : null}
                  onChange={(value: Date) => formik.setFieldValue('call_time', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<ResidentInterface>
              formik={formik}
              name={'resident_id'}
              label={'Select Resident'}
              placeholder={'Select Resident'}
              fetcher={getResidents}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.first_name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'automated_call_status',
  operation: AccessOperationEnum.UPDATE,
})(AutomatedCallStatusEditPage);
