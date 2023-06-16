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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createAutomatedCallStatus } from 'apiSdk/automated-call-statuses';
import { Error } from 'components/error';
import { automatedCallStatusValidationSchema } from 'validationSchema/automated-call-statuses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ResidentInterface } from 'interfaces/resident';
import { getResidents } from 'apiSdk/residents';
import { AutomatedCallStatusInterface } from 'interfaces/automated-call-status';

function AutomatedCallStatusCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AutomatedCallStatusInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAutomatedCallStatus(values);
      resetForm();
      router.push('/automated-call-statuses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AutomatedCallStatusInterface>({
    initialValues: {
      status: '',
      call_time: new Date(new Date().toDateString()),
      resident_id: (router.query.resident_id as string) ?? null,
    },
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
            Create Automated Call Status
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'automated_call_status',
  operation: AccessOperationEnum.CREATE,
})(AutomatedCallStatusCreatePage);
