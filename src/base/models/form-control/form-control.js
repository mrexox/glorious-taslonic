import idService from '@base/services/id/id';
import formControlService from '@base/services/form-control/form-control';

export class FormControlModel {
  constructor(formControlEl, options = {}){
    this.setId(idService.generate());
    this.configElement(formControlEl, options);
    this.setOptions(options);
    setTimeout(() => {
      this.configForm(formControlEl);
      this.configValidations(formControlEl, options.validations);
    });
  }
  setId(id){
    this.id = id;
  }
  configElement(element, { required, value }){
    this.element = element;
    if(required) this.setElementRequired(required);
    if(value) this.setElementValue(value);
    this.handleAutofocus();
  }
  setElementValue(value){
    this.element.value = value;
  }
  setElementRequired(required){
    this.element.required = required;
  }
  handleAutofocus(){
    if(this.element.getAttribute('autofocus')) this.element.focus();
  }
  setOptions(options){
    this.options = options;
  }
  configForm(formControlEl){
    this.setForm(formControlService.findParentFormModel(formControlEl));
    if(this.form)
      this.setSubmitListenerId(this.form.onSubmit(() => {
        this.setBlurred(true);
        this.validate(formControlEl);
      }));
  }
  setForm(form){
    this.form = form;
  }
  configValidations(formControlEl, validations = []){
    this.setValidations(validations);
    this.configValidationListeners(formControlEl);
    this.validate(formControlEl);
  }
  setValidations(validations){
    this.validations = validations;
  }
  configValidationListeners(formControlEl){
    formControlEl.addEventListener('input', evt => this.onInput(evt));
    formControlEl.addEventListener('blur', evt => this.onBlur(evt));
  }
  onInput(evt){
    this.validate(evt.target);
    this.handleCallbackOption('onInput', evt);
  }
  onBlur({ target }){
    this.setBlurred(true);
    this.validate(target);
  }
  onRequiredChange(required){
    this.setElementRequired(required);
    this.validate(this.element);
  }
  validate({ value }){
    const errors = this.buildValidations().map(({ isValid, errorMessage }) => {
      if(!isValid(value)) return errorMessage;
    }).filter(err => !!err);
    return errors.length ? this.emitError(errors[0]) : this.emitSuccess();
  }
  buildValidations(){
    const validations = [...this.validations];
    if(this.element.required) validations.unshift(formControlService.buildRequiredValidation());
    return validations;
  }
  emitError(err){
    if(this.form) this.form.setError(this.id, { element: this.element, message: err});
    if(this.hasBeenBlurred) this.handleCallbackOption('onValidate', err);
  }
  emitSuccess(){
    if(this.form) this.form.clearError(this.id);
    if(this.hasBeenBlurred) this.handleCallbackOption('onValidate');
  }
  handleCallbackOption(option, data){
    const callback = this.options[option];
    return callback && callback(data);
  }
  setBlurred(hasBeenBlurred){
    this.hasBeenBlurred = hasBeenBlurred;
  }
  setSubmitListenerId(id){
    this.submitListenerId = id;
  }
  destroy(){
    this.form && this.clearControlFromParentFormModel();
  }
  clearControlFromParentFormModel(){
    this.form.clearError(this.id);
    this.form.removeSubmitListener(this.submitListenerId);
  }
}
