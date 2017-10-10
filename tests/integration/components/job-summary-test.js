import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import UserStub from '../../helpers/user-stub';

moduleForComponent('job-summary', 'Integration | Component | job summary', {
  integration: true,
  beforeEach() {
    this.register('service:user', UserStub);
  }
});

test('it renders summary heading', function(assert) {
  const job = Ember.Object.create({
    name: 'Test Job'
  });
  this.set('job', job);
  this.render(hbs`{{job-summary job}}`);
  assert.equal(this.$('h3').text().trim(), 'Summary for Job \'Test Job\'');
});

test('it renders 2 summary detail rows', function(assert) {
  this.render(hbs`{{job-summary}}`);
  assert.equal(this.$('.job-summary-detail-row').length, 2);
});
