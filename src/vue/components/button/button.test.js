import { shallowMount } from '@vue/test-utils';
import { button } from './button';

describe('Button', () => {
  function mount(propsData = {}, content = ''){
    return shallowMount(button, { propsData, slots: { default: content } });
  }

  it('should have base css class', () => {
    const wrapper = mount();
    expect(wrapper.classes()).toContain('t-button');
  });

  it('should render a button using a button tag name by default', () => {
    const wrapper = mount();
    expect(wrapper.vm.$el.tagName.toLowerCase()).toEqual('button');
  });

  it('should optionally render a button using a anchor tag name', () => {
    const wrapper = mount({ tag: 'a' });
    expect(wrapper.vm.$el.tagName.toLowerCase()).toEqual('a');
  });

  it('should optionally set a primary theme', () => {
    const wrapper = mount({ theme: 'primary' });
    expect(wrapper.classes()).toContain('t-button-primary');
  });

  it('should optionally set a secondary theme', () => {
    const wrapper = mount({ theme: 'secondary' });
    expect(wrapper.classes()).toContain('t-button-secondary');
  });

  it('should optionally set as blocked', () => {
    const wrapper = mount({ blocked: true });
    expect(wrapper.classes()).toContain('t-button-blocked');
  });

  it('should render some content', () => {
    const wrapper = mount({}, '<span>Click</span>');
    expect(wrapper.find('span').text()).toEqual('Click');
  });
});
