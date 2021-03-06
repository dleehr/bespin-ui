import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('questionnaire/answer-form', 'Integration | Component | questionnaire/answer form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{questionnaire/answer-form}}`);

  assert.notEqual(this.$().text().trim().indexOf('Job Name:'), -1);
  assert.notEqual(this.$().text().trim().indexOf('Fund Code:'), -1);
});
