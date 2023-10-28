import Vue from 'vue'
import ReadingsManager from '@/components/ReadingsManager'
import i18n from '../../../src/i18n'

describe('ReadingsManager.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(ReadingsManager)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.ReadingsManager h1').textContent)
      .to.equal(i18n.t('reading.manager'))
  })
})
