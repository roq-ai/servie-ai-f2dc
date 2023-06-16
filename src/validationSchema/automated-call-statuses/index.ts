import * as yup from 'yup';

export const automatedCallStatusValidationSchema = yup.object().shape({
  status: yup.string().required(),
  call_time: yup.date().required(),
  resident_id: yup.string().nullable().required(),
});
