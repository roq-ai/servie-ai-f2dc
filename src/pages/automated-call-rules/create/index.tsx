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
import { createAutomatedCallRule } from 'apiSdk/automated-call-rules';
import { Error } from 'components/error';
import { automatedCallRuleValidationSchema } from 'validationSchema/automated-call-rules';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ResidentInterface } from 'interfaces/resident';
import { getResidents } from 'apiSdk/residents';
import { AutomatedCallRuleInterface } from 'interfaces/automated-call-rule';

function AutomatedCallRuleCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AutomatedCallRuleInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAutomatedCallRule(values);
      resetForm();
      router.push('/automated-call-rules');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AutomatedCallRuleInterface>({
    initialValues: {
      rule_type: '',
      time: new Date(new Date().toDateString()),
      resident_id: (router.query.resident_id as string) ?? null,
    },
    validationSchema: automatedCallRuleValidationSchema,
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
            Create Automated Call Rule
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="rule_type" mb="4" isInvalid={!!formik.errors?.rule_type}>
            <FormLabel>Rule Type</FormLabel>
            <Input type="text" name="rule_type" value={formik.values?.rule_type} onChange={formik.handleChange} />
            {formik.errors.rule_type && <FormErrorMessage>{formik.errors?.rule_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="time" mb="4">
            <FormLabel>Time</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.time ? new Date(formik.values?.time) : null}
                onChange={(value: Date) => formik.setFieldValue('time', value)}
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
  entity: 'automated_call_rule',
  operation: AccessOperationEnum.CREATE,
})(AutomatedCallRuleCreatePage);
