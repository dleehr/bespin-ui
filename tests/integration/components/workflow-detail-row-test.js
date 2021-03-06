import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('workflow-detail-row', 'Integration | Component | workflow detail row', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{workflow-detail-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#workflow-detail-row}}
      template block text
    {{/workflow-detail-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
