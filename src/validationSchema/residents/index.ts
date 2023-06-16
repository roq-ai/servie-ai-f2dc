import * as yup from 'yup';

export const residentValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  phone_number: yup.string().required(),
  facility_id: yup.string().nullable().required(),
});
