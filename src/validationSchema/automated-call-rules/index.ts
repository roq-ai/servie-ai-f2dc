import * as yup from 'yup';

export const automatedCallRuleValidationSchema = yup.object().shape({
  rule_type: yup.string().required(),
  time: yup.date().required(),
  resident_id: yup.string().nullable().required(),
});
