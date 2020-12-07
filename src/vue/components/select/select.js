import selectService from '@base/services/select/select';
import { formControl } from '@vue/components/form-control/form-control';
import template from './select.html';

export const select = {
  name: 't-select',
  components: {
    tFormControl: formControl
  },
  props: {
    value: { type: String },
    validations: { type: Array },
    autofocus: { type: Boolean },
    blocked: { type: Boolean },
    required: { type: Boolean },
    disabled: { type: Boolean }
  },
  computed: {
    wrapperCssClasses(){
      const { disabled } = this;
      return selectService.buildWrapperCssClasses({ disabled });
    }
  },
  template
};
